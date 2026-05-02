import exp from "express";
import { UserModel } from "../models/UserModel.js";
import { hash, compare } from "bcryptjs";
import { config } from "dotenv";
import jwt from "jsonwebtoken";
import { verifyToken } from "../middlewares/VerifyToken.js";

const { sign } = jwt;
export const commonApp = exp.Router();

import { upload } from "../config/multer.js";
import { uploadToCloudinary } from "../config/cloudinaryUpload.js";
import cloudinary from "../config/cloudinary.js";

config();


// ======================== REGISTER ========================
commonApp.post("/users", upload.single("profileImageUrl"), async (req, res, next) => {
  let cloudinaryResult = null;

  try {
    let allowedRoles = ["USER", "AUTHOR"];
    const newUser = req.body;

    if (!allowedRoles.includes(newUser.role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    if (req.file) {
      cloudinaryResult = await uploadToCloudinary(req.file.buffer);
    }

    newUser.profileImageUrl = cloudinaryResult?.secure_url;
    newUser.password = await hash(newUser.password, 12);

    const newUserDoc = new UserModel(newUser);
    await newUserDoc.save();

    res.status(201).json({ message: "User created" });
  } catch (err) {
    console.log("err is ", err);

    if (cloudinaryResult?.public_id) {
      await cloudinary.uploader.destroy(cloudinaryResult.public_id);
    }

    next(err);
  }
});


// ======================== LOGIN ========================
commonApp.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "error", error: "Invalid email" });
    }

    const isMatched = await compare(password, user.password);
    if (!isMatched) {
      return res.status(400).json({ message: "error", error: "Invalid password" });
    }

    const signedToken = sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        profileImageUrl: user.profileImageUrl,
      },
      process.env.SECRET_KEY,
      { expiresIn: "1d" }
    );

    // ✅ FIXED COOKIE
    res.cookie("token", signedToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/"
    });

    let userObj = user.toObject();
    delete userObj.password;

    res.status(200).json({ message: "login success", payload: userObj });

  } catch (err) {
    next(err);
  }
});


// ======================== LOGOUT ========================
commonApp.get("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/"
  });

  res.status(200).json({ message: "Logout success" });
});


// ======================== CHECK AUTH ========================
commonApp.get(
  "/check-auth",
  verifyToken("USER", "AUTHOR", "ADMIN"),
  (req, res) => {
    res.status(200).json({
      message: "authenticated",
      payload: req.user,
    });
  }
);


// ======================== PASSWORD ========================
commonApp.put(
  "/password",
  verifyToken("USER", "AUTHOR", "ADMIN"),
  async (req, res, next) => {
    // TODO: implement
  }
);
import express from "express";
import { config } from "dotenv";
import { connect } from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import { userApp } from "./APIs/UserAPI.js";
import { authorApp } from "./APIs/AuthorAPI.js";
import { adminApp } from "./APIs/AdminAPI.js";
import { commonApp } from "./APIs/CommonAPI.js";

config();
const app = express();

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || origin.endsWith(".vercel.app") || origin.includes("localhost")) {
      callback(null, true);
    } else {
      callback(new Error("CORS blocked: " + origin));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.options("*", cors());

app.use(express.json());
app.use(cookieParser());

app.use("/user-api", userApp);
app.use("/author-api", authorApp);
app.use("/admin-api", adminApp);
app.use("/auth", commonApp);

const port = process.env.PORT || 4000;
connect(process.env.DB_URL)
  .then(() => {
    console.log("DB connected");
    app.listen(port, () => console.log(`Server running on ${port}`));
  })
  .catch((err) => console.log("DB error:", err.message));

app.use((req, res) => {
  res.status(404).json({ message: `Path ${req.url} is invalid` });
});

app.use((err, req, res, next) => {
  if (err.name === "ValidationError")
    return res.status(400).json({ message: "Validation error", error: err.message });
  if (err.name === "CastError")
    return res.status(400).json({ message: "Invalid ID format", error: err.message });
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({ message: "Duplicate error", error: `${field} already exists` });
  }
  res.status(500).json({ message: "Server error", error: err.message || "Something went wrong" });
});
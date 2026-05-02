import exp from "express";
import { config } from "dotenv";
import { connect } from "mongoose";
import { userApp } from "./APIs/UserAPI.js";
import { authorApp } from "./APIs/AuthorAPI.js";
import { adminApp } from "./APIs/AdminAPI.js";
import { commonApp } from "./APIs/CommonAPI.js";
import cookieParser from "cookie-parser";
import cors from 'cors'
config();

//create express app
const app = exp();
//enable cors
// app.use(cors({
//   origin:['http://localhost:5173'],
//   credentials:true
// }))
app.use(cors({
  origin: "https://blog-app-13-s3pi.onrender.com",
  credentials: true
}));
//add cookie parser middeleware
app.use(cookieParser())
//body parser middleware
app.use(exp.json());
//path level middlewares
app.use("/user-api", userApp);
app.use("/author-api", authorApp);
app.use("/admin-api", adminApp);
app.use("/auth", commonApp);

//connect to db
// const connectDB = async () => {
//   try {
//      const port = process.env.PORT||4000;
//     app.listen(port, () => console.log(`server listening on ${port}..`));
//     await connect(process.env.DB_URL);
//     console.log("DB server connected");

//   } catch (err) {
//     console.log("err in db connect", err);
//   }
// };
const port = process.env.PORT || 4000;

// Start server FIRST
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Then connect DB
connect(process.env.DB_URL)
  .then(() => {
    console.log("DB connected successfully");
  })
  .catch((err) => {
    console.log("DB connection error:", err.message);
  });


//to handle invalid path
app.use((req, res, next) => {
  console.log(req.url);
  res.status(404).json({ message: `path ${req.url} is invalid` });
});

//Error handling middleware
app.use((err, req, res, next) => {
  console.log("error is ",err)
  console.log("Full error:", JSON.stringify(err, null, 2));
  //ValidationError
  if (err.name === "ValidationError") {
    return res.status(400).json({ message: "error occurred", error: err.message });
  }
  //CastError
  if (err.name === "CastError") {
    return res.status(400).json({ message: "error occurred", error: err.message });
  }
  const errCode = err.code ?? err.cause?.code ?? err.errorResponse?.code;
  const keyValue = err.keyValue ?? err.cause?.keyValue ?? err.errorResponse?.keyValue;

  if (errCode === 11000) {
    const field = Object.keys(keyValue)[0];
    const value = keyValue[field];
    return res.status(409).json({
      message: "error occurred",
      error: `${field} "${value}" already exists`,
    });
  }

  //send server side error
  res.status(500).json({ message: "error occurred", error: "Server side error" });
});

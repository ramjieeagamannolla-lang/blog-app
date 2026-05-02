import cloudinary from "./cloudinary.js";

export const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    if (!buffer) {
      return reject(new Error("No file buffer received"));
    }

    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "blog_users_b2",
      },
      (err, result) => {
        if (err) {
          console.log("Cloudinary upload error:", err);
          return reject(err);
        }
        resolve(result);
      }
    );

    stream.end(buffer);
  });
};
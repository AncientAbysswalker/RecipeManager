const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

// Define Multer Storage
var storage = multer.diskStorage({
  destination: (request, file, cb) => {
    cb(null, "/data/images"); // Save location on server
  },
  filename: (request, file, cb) => {
    cb(null, uuidv4() + path.extname(file.originalname)); // Generate unique id/name for image
  },
});
const upload = multer({ storage: storage });

// ExpressJS Router
router
  // If trying to access images without filename, then redirect to root
  .get("/", (request, response) => {
    request.redirect("../");
  })

  // Host image files
  .use("/", express.static("/data/images"))

  // Allow Image Upload
  .post("/upload", upload.single("profile_pic"), (request, response) => {
    return response.status(201).send({
      status: 201,
      message: "Image Uploaded Successfully",
      filename: request.file.filename,
    });
  })

  // Temporary testing of image upload
  .use("/testUpload", express.static("/data/imageupload"));

module.exports = router;

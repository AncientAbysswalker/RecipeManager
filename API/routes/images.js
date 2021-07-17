module.exports = (client, log_requests, log_errors, color_disabled) => {
  const express = require("express");
  const router = express.Router();
  const path = require("path");
  const multer = require("multer");
  const { v4: uuidv4 } = require("uuid");

  // Load logging helper
  const log = require("../helpers/logging")(
    log_requests,
    log_errors,
    color_disabled
  );

  // Load query helpers and middleware
  const mdw = require("../helpers/middleware");

  // Upload Limits
  const max_filesize = 10000000; // 10MB

  // Define Multer Storage
  var storage = multer.diskStorage({
    destination: (request, file, cb) => {
      cb(null, "/data/images"); // Save location on server
    },
    filename: (request, file, cb) => {
      cb(null, uuidv4() + path.extname(file.originalname)); // Generate unique id/name for image
    },
  });
  const upload = multer({
    storage: storage,
    limits: { fileSize: max_filesize },
    fileFilter: (_req, file, cb) => checkFileType(file, cb),
  });

  // Image Verification
  function checkFileType(file, cb) {
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    // Check ext
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb({
        message: "Invalid File Type or Corrupted Image File",
        code: "INVALID_TYPE",
      });
    }
  }

  // ExpressJS Router
  router
    // If trying to access images without filename, then redirect to root
    .get("/", (request, response) => {
      request.redirect("../");
    })

    // Host image files
    .use("/", express.static("/data/images"))

    // Allow Image Upload
    .post("/upload", mdw.setReqType("UPLOAD"), (request, response) => {
      upload.array("images")(request, response, (err) => {
        if (!err) {
          log.success(
            request,
            201
          );
          return response.status(201).send({
            status: 201,
            message: "Image Uploaded Successfully",
            hostedSources: request.files.map(file => file.filename)
          });
        } else {
          switch (err.code) {
            case "INVALID_TYPE":
              log.fail(
                request,
                422,
                "Corrupted Image File or Invalid File Type - Supported Types are jpg, jpeg, gif, png"
              );
              return response.status(422).send({
                status: 422,
                message:
                  "Invalid File Type or Corrupted Image File - Supported Types are jpg, jpeg, gif, png",
              });
              break;
            case "LIMIT_FILE_SIZE":
              log.fail(
                request,
                422,
                "Image is too large. Maximum size of 10MB"
              );
              return response.status(422).send({
                status: 422,
                message: "Image is too large. Maximum size of 10MB",
              });
              break;
            default:
              log.fail(
                request,
                422,
                err.message
              );
              return response.status(422).send({
                status: 422,
                message: err.message,
              });
              break;
          }
        }
      });
    });

  return router;
};

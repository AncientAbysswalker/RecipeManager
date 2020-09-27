/* eslint-disable no-control-regex */
const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

// Load config
const config = require("./config.js");

// Load Routings
const route_images = require("./router_images");

// Retrieve Mongo Client
const mongo = require("mongodb");
const MongoClient = mongo.MongoClient;

// Use body-parser to parse the body af a request
let bodyParser = require("body-parser");
app.use(bodyParser.json());

// Parse args for process
let p_args = process.argv.slice(2);
let log_requests = !p_args.includes("--nolog-req");
let log_errors = !p_args.includes("--nolog-err");
let color_disabled = p_args.includes("--nocolor");

// Load colored string helper
const c = require("./helpers/string_colors")(color_disabled);

// Log that process is starting
console.log(c.cyn("Attempting to start mongo router"));

// Connect to the db and listen
MongoClient.connect(
  config.uri,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (client_err, client) => {
    if (!client_err) {
      const route_recipes = require("./router_recipes")(client);
      // let db = client.db(config.db);
      // let recipes = db.collection("recipes");

      // // Enable CORS -- Or use unsafe mode on chrome (I do now)
      // // app.use((req, res, next) => {
      // //   res.header("Access-Control-Allow-Origin", "http://localhost:8080"); // update to match the domain you will make the request from
      // //   res.header(
      // //     "Access-Control-Allow-Headers",
      // //     "Origin, X-Requested-With, Content-Type, Accept"
      // //   );
      // //   next();
      // // });

      // // [POST] a new recipe to the mongo db
      // app.post("/recipes", (request, response) => {
      //   // Log request and save time of request
      //   let time_req = logPost(request.originalUrl);

      //   try {
      //     // Build new entry from request body. Any fields not included will become null
      //     let new_entry = {
      //       name: request.body.name,
      //       time_active: request.body.time_active,
      //       time_passive: request.body.time_passive,
      //       ingredients: request.body.ingredients,
      //       instructions: request.body.instructions,
      //     };

      //     // Insert one recipe
      //     recipes.insertOne(new_entry, (err, result) => {
      //       if (!err) {
      //         logSuccess("POST", request.originalUrl, time_req, 201);
      //         response.status(201).send(result.ops[0]);
      //       } else {
      //         logFailure("POST", request.originalUrl, time_req, 500, err);
      //         response.status(500).send({
      //           status: 500,
      //           message: "Internal database exception",
      //         });
      //       }
      //     });
      //   } catch (err) {
      //     logFailure("POST", request.originalUrl, time_req, 500, err);
      //     response.status(500).send({
      //       status: 500,
      //       message: "Internal database exception",
      //     });
      //   }
      // });

      // // [GET] the data for all recipes, with optional filtering
      // app.get("/recipes", (request, response) => {
      //   // Log request and save time of request
      //   let time_req = logGet(request.originalUrl);

      //   try {
      //     // Ensure that the fields will always be a list
      //     let fields = paramToList(request.query.fields);

      //     // Query mongo db
      //     recipes
      //       .find()
      //       .project(fields.reduce((a, b) => ((a[b] = 1), a), {}))
      //       .toArray((err, result_raw) => {
      //         // Strip result of any entries only containing _id
      //         let result = filterEmpty(result_raw, fields.includes("_id"));

      //         if (!err) {
      //           if (result.length !== 0) {
      //             logSuccess("GET", request.originalUrl, time_req, 200);
      //             response.json(result);
      //           } else {
      //             logFailure(
      //               "GET",
      //               request.originalUrl,
      //               time_req,
      //               404,
      //               "The requested resource could not be found"
      //             );
      //             response.status(404).send({
      //               status: 404,
      //               message: "The requested resource could not be found",
      //             });
      //           }
      //         } else {
      //           logFailure("GET", request.originalUrl, time_req, 500, err);
      //           response.status(500).send({
      //             status: 500,
      //             message: "Internal database exception",
      //           });
      //         }
      //       });
      //   } catch (err) {
      //     logFailure("GET", request.originalUrl, time_req, 500, err);
      //     response.status(500).send({
      //       status: 500,
      //       message: "Internal database exception",
      //     });
      //   }
      // });

      // // [GET] the data for one recipe using its db id, with optional filtering
      // app.get("/recipes/:id", (request, response) => {
      //   // Log request and save time of request
      //   let time_req = logGet(request.originalUrl);

      //   // First confirm that the id request is OK
      //   try {
      //     // Get the id in the appropriate format
      //     let id = new mongo.ObjectID(request.params.id);
      //     try {
      //       // Ensure that the fields will always be a list
      //       let fields = paramToList(request.query.fields);

      //       recipes.findOne(
      //         { _id: id },
      //         { projection: fields.reduce((a, b) => ((a[b] = 1), a), {}) },
      //         (err, result) => {
      //           if (!err) {
      //             // If response is null or only the _id, respond 404
      //             if (result === null || Object.keys(result).length === 1) {
      //               logFailure(
      //                 "GET",
      //                 request.originalUrl,
      //                 time_req,
      //                 404,
      //                 "The requested resource could not be found"
      //               );
      //               response.status(404).send({
      //                 status: 404,
      //                 message: "The requested resource could not be found",
      //               });
      //             } else {
      //               logSuccess("GET", request.originalUrl, time_req, 200);
      //               response.json(result);
      //             }
      //           } else {
      //             logFailure("GET", request.originalUrl, time_req, 500, err);
      //             response.status(500).send({
      //               status: 500,
      //               message: "Internal database exception",
      //             });
      //           }
      //         }
      //       );
      //     } catch (err) {
      //       logFailure("GET", request.originalUrl, time_req, 500, err);
      //       response.status(500).send({
      //         status: 500,
      //         message: "Internal database exception",
      //       });
      //     }

      //     // If the wrong number of bytes is provided
      //   } catch {
      //     logFailure(
      //       "GET",
      //       request.originalUrl,
      //       time_req,
      //       400,
      //       "The id provided must be a single string of 12 bytes or 24 hex characters"
      //     );
      //     response.status(400).send({
      //       status: 400,
      //       message:
      //         "The id provided must be a single string of 12 bytes or 24 hex characters",
      //     });
      //   }
      // });
      app.use("/recipes", route_recipes);

      // // Handle Images
      // var storage = multer.diskStorage({
      //   destination: (req, file, cb) => {
      //     cb(null, "/data/images");
      //   },
      //   filename: (req, file, cb) => {
      //     cb(
      //       null,
      //       uuidv4() + path.extname(file.originalname) //file.fieldname + "-" + Date.now() + path.extname(file.originalname)
      //     );
      //   },
      // });
      // //will be using this for uplading
      // const upload = multer({ storage: storage });
      // app.use("/images", express.static("/data/images")); //, serveIndex('/data/images', {'icons': true}));
      // app.post("/testUpload", upload.single("profile_pic"), (req, res) => {
      //   console.log(req.file.path);
      //   return res.status(201).send({
      //     status: 201,
      //     message: "Saved Image",
      //   });
      // });

      // Indicate successful start in the console
      app.listen(3000, function() {
        console.log(c.grn("Mongo router successfully started on port 3000"));
        logOption("Logging of requests to file", log_requests);
        logOption("Logging of errors to file", log_errors);
        logOption("Monochrome white text", color_disabled);

        // Extra newline
        console.log();
      });
    } else {
      console.log(c.red("Mongo router failed to start:"), client_err);
    }
  }
);

// Handle Mongo
//app.use("/recipes", route_recipes);

// Handle Image Hosting and Upload
app.use("/images", route_images);

// Host Documentation
app.get("/", (request, response) => {
  response.redirect("/documentation");
});
app.use("/documentation", express.static("/data/documentation"));

// Convert a number to a two-digit number
function enforceTwoDigit(num) {
  return num > 9 ? num : "0" + num;
}

// Build the CLF string
function buildCLF(ip, uid, time_req, method, req, status, size) {
  return `${ip} - ${uid} [${time_req}] "${method} ${req}" ${status} ${size}\n`;
}

// Build a time stamp for the CLF format
function getCLFDate() {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Get the time string bits
  let date = new Date();
  let dd = enforceTwoDigit(date.getDate());
  let mmm = months[date.getMonth()];
  let yyyy = date.getFullYear();
  let HH = enforceTwoDigit(date.getHours());
  let MM = enforceTwoDigit(date.getMinutes());
  let SS = enforceTwoDigit(date.getSeconds());
  let zzzz = "0000";

  return `${dd}/${mmm}/${yyyy}:${HH}:${MM}:${SS} ${zzzz}`;
}

// Log timestamp and that a GET request is recieved to console. Return timestamp of request
function logGet(req) {
  return logRequest("[GET]", req);
}

// Log timestamp and that a POST request is recieved to console. Return timestamp of request
function logPost(req) {
  return logRequest("[POST]", req);
}

// Log timestamp and that request is recieved to console. Return timestamp of request
function logRequest(method, req) {
  let clf_date = getCLFDate();

  console.log(clf_date);
  console.log(`Recieved ${c.yel(method)} request ${c.cyn(req)}`);

  return clf_date;
}

// Log an error on the console and log the data to the error log file if not disabled
function logFailure(method, req, time_req, status, err_str) {
  // Log to console
  console.log(`Request ${c.red("failed")} with status ${c.cyn(status)}\n`);

  // Log request to clf log file
  if (log_requests) {
    fs.appendFile(
      "./log_req.txt",
      buildCLF("-", "-", time_req, method, req, status, "size"),
      () => {} // No Callback Needed
    );
  }

  // Log request to error log file
  if (log_errors) {
    fs.appendFile(
      "./log_err.txt",
      `${time_req}\n${err_str}\n\n`,
      () => {} // No Callback Needed
    );
  }
}

// Log a success on the console and log the data to the clf log file if not disabled
function logSuccess(method, req, time_req, status) {
  // Log to console
  console.log(`Request ${c.grn("successful")} with status ${c.cyn(status)}\n`);

  // Log request to clf log file
  if (log_requests) {
    fs.appendFile(
      "./log_req.txt",
      buildCLF("-", "-", time_req, method, req, status, "size"),
      () => {} // No Callback Needed
    );
  }
}

// Log application options on startup to the console
function logOption(option, bool) {
  // Log to console
  console.log(
    `- ${option} is currently ${bool ? c.grn("enabled") : c.red("disabled")}`
  );
}

// Return a list, string, or null as a list, for purposes of query projection
function paramToList(param) {
  switch (typeof param) {
    case "string":
      return [param];
    case "object":
      return param;
    default:
      return [];
  }
}

// Strip a list of objects of any object that has only one key
function filterEmpty(ls, override = false) {
  return override ? ls : ls.filter((obj) => Object.keys(obj).length !== 1);
}

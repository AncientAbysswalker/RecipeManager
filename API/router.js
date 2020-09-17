/* eslint-disable no-control-regex */
const express = require("express");
const app = express();
const fs = require("fs");

// Load config
const config = require("./config.js");

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

// Log that process is starting
console.log(c_cyn("Attempting to start mongo router"));

// Connect to the db and listen
MongoClient.connect(
  config.uri,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (client_err, client) => {
    if (!client_err) {
      let db = client.db(config.db);
      let recipes = db.collection("recipes");

      // [POST] a new recipe to the mongo db
      app.post("/recipes", (request, response) => {
        // Log request and save time of request
        let time_req = logPost(request.originalUrl);

        try {
          // Build new entry from request body. Any fields not included will become null
          let new_entry = {
            name: request.body.name,
            time_active: request.body.time_active,
            time_passive: request.body.time_passive,
            ingredients: request.body.ingredients,
            instructions: request.body.instructions,
          };

          // Insert one recipe
          recipes.insertOne(new_entry, (err, result) => {
            if (!err) {
              logSuccess("POST", request.originalUrl, time_req, 201);
              response.status(201).send(result.ops[0]);
            } else {
              logFailure("POST", request.originalUrl, time_req, 500, err);
              response.status(500).send({
                status: 500,
                message: "Internal database exception",
              });
            }
          });
        } catch (err) {
          logFailure("POST", request.originalUrl, time_req, 500, err);
          response.status(500).send({
            status: 500,
            message: "Internal database exception",
          });
        }
      });

      // [GET] the data for all recipes, with optional filtering
      app.get("/recipes", (request, response) => {
        // Log request and save time of request
        let time_req = logGet(request.originalUrl);

        try {
          // Ensure that the fields will always be a list
          let fields = paramToList(request.query.fields);

          // Query mongo db
          recipes
            .find()
            .project(fields.reduce((a, b) => ((a[b] = 1), a), {}))
            .toArray((err, result_raw) => {
              // Strip result of any entries only containing _id
              let result = filterEmpty(result_raw, fields.includes("_id"));

              if (!err) {
                if (result.length !== 0) {
                  logSuccess("GET", request.originalUrl, time_req, 200);
                  response.json(result);
                } else {
                  logFailure(
                    "GET",
                    request.originalUrl,
                    time_req,
                    404,
                    "The requested resource could not be found"
                  );
                  response.status(404).send({
                    status: 404,
                    message: "The requested resource could not be found",
                  });
                }
              } else {
                logFailure("GET", request.originalUrl, time_req, 500, err);
                response.status(500).send({
                  status: 500,
                  message: "Internal database exception",
                });
              }
            });
        } catch (err) {
          logFailure("GET", request.originalUrl, time_req, 500, err);
          response.status(500).send({
            status: 500,
            message: "Internal database exception",
          });
        }
      });

      // [GET] the data for one recipe using its db id, with optional filtering
      app.get("/recipes/:id", (request, response) => {
        // Log request and save time of request
        let time_req = logGet(request.originalUrl);

        // First confirm that the id request is OK
        try {
          // Get the id in the appropriate format
          let id = new mongo.ObjectID(request.params.id);
          try {
            // Ensure that the fields will always be a list
            let fields = paramToList(request.query.fields);
            console.log(fields);
            console.log(fields.reduce((a, b) => ((a[b] = 1), a), {}));

            recipes.findOne(
              { _id: id },
              { projection: fields.reduce((a, b) => ((a[b] = 1), a), {}) },
              (err, result_raw) => {
                // Return result as null if only has _id field
                let result =
                  Object.keys(result_raw).length !== 1 ? result_raw : null;

                if (!err) {
                  // If response is null, respond 404
                  if (result !== null) {
                    logSuccess("GET", request.originalUrl, time_req, 200);
                    response.json(result);
                  } else {
                    logFailure(
                      "GET",
                      request.originalUrl,
                      time_req,
                      404,
                      "The requested resource could not be found"
                    );
                    response.status(404).send({
                      status: 404,
                      message: "The requested resource could not be found",
                    });
                  }
                } else {
                  logFailure("GET", request.originalUrl, time_req, 500, err);
                  response.status(500).send({
                    status: 500,
                    message: "Internal database exception",
                  });
                }
              }
            );
          } catch (err) {
            logFailure("GET", request.originalUrl, time_req, 500, err);
            response.status(500).send({
              status: 500,
              message: "Internal database exception",
            });
          }

          // If the wrong number of bytes is provided
        } catch {
          logFailure(
            "GET",
            request.originalUrl,
            time_req,
            400,
            "The id provided must be a single string of 12 bytes or 24 hex characters"
          );
          response.status(400).send({
            status: 400,
            message:
              "The id provided must be a single string of 12 bytes or 24 hex characters",
          });
        }
      });

      // Indicate successful start in the console
      app.listen(3000, function() {
        console.log(c_grn("Mongo router successfully started on port 3000"));
        console.log(
          ` - Logging to file is currently ${
            log_requests ? c_grn("enabled") : c_red("disabled")
          }\n`
        );
      });
    } else {
      console.log(c_red("Mongo router failed to start:"), client_err);
    }
  }
);

// Color interrupt functions for in-console strings
function c_yel(str) {
  return color_disabled ? str : `\x1b[33m${str}\x1b[0m`;
}
function c_grn(str) {
  return color_disabled ? str : `\x1b[32m${str}\x1b[0m`;
}
function c_cyn(str) {
  return color_disabled ? str : `\x1b[36m${str}\x1b[0m`;
}
function c_red(str) {
  return color_disabled ? str : `\x1b[31m${str}\x1b[0m`;
}
function stripColor(str) {
  return str.replace(/\x1b\[[0-9]+m/g, "");
}

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
  console.log(`Recieved ${c_yel(method)} request ${c_cyn(req)}`);

  return clf_date;
}

// Log an error on the console and log the data to the error log file if not disabled
function logFailure(method, req, time_req, status, err_str) {
  // Log to console
  console.log(`Request ${c_red("failed")} with status ${c_cyn(status)}\n`);

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
  console.log(`Request ${c_grn("successful")} with status ${c_cyn(status)}\n`);

  // Log request to clf log file
  if (log_requests) {
    fs.appendFile(
      "./log_req.txt",
      buildCLF("-", "-", time_req, method, req, status, "size"),
      () => {} // No Callback Needed
    );
  }
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

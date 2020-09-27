/* eslint-disable no-control-regex */
const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

// Load config
const config = require("./routes/config.js");

// Load Routings
const route_images = require("./routes/images");

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
      const route_recipes = require("./routes/recipes")(client);
      app.use("/recipes", route_recipes);

      app.listen(3000, () => {
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

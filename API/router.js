const express = require("express");
const app = express();

// Load config
const config = require("./routes/config.js");

// Load builder for CLF

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

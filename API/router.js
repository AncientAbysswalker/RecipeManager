const express = require("express");
const app = express();

// Load config
const config = require("./mongo_config");

// Allow Cross-Origin
var allowCrossDomain = function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  next();
}
app.use(allowCrossDomain)

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

// Retrieve Mongo Client
const mongo = require("mongodb");
const MongoClient = mongo.MongoClient;

// Connect to the db and listen
MongoClient.connect(
  config.uri,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (client_err, client) => {
    // If mongo failed to connect, indicate that the router failed to start
    if (!client_err) {
      // Handle Routing for recipe API
      const route_recipes = require("./routes/recipes")(
        client,
        log_requests,
        log_errors,
        color_disabled
      );
      app.use("/recipes", route_recipes);

      // Handle Routing for userdata API
      const route_userdata = require("./routes/userdata")(
        client,
        log_requests,
        log_errors,
        color_disabled
      );
      app.use("/userdata", route_userdata);

      // Indicate if the router has started successfully
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

// Handle Routing for Image Hosting and Upload
const route_images = require("./routes/images")(
  log_requests,
  log_errors,
  color_disabled
);
app.use("/images", route_images);

// Handle Routing and Hosting of Documentation
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

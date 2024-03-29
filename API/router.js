const express = require("express");
const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');
const session = require('express-session');

// Load config
const config = require("./mongo_config");

var allowCrossDomain = function (req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http:\/\/app.raviole.cerberus-heuristics.com');// '50.92.225.75');
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-PINGOTHER,X-Requested-With, Content-Type, Accept');
  next();
}
app.use(allowCrossDomain)

// Use body-parser to parse the body af a request
let bodyParser = require("body-parser");
app.use(session({
  secret: '136c67657614311f32238751044a0a3c0294f2a521e573afa8e496992d3786ba', // This is a personal project, so I'm not concerned about the secret being visibla at this point!
  name: 'sessionId',
  resave: false,
  saveUninitialized: false
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

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

      // Handle Routing for recipe API for user-saved recipes
      const route_recipes_user = require("./routes/user-saved-recipes")(
        client,
        log_requests,
        log_errors,
        color_disabled
      );
      app.use("/user-saved-recipes", route_recipes_user);

      // Handle Routing for userdata API
      const route_userdata = require("./routes/userdata")(
        client,
        log_requests,
        log_errors,
        color_disabled
      );
      app.use("/userdata", route_userdata);

      // Handle Routing for user access
      const route_uac = require("./routes/uac")(
        client,
        log_requests,
        log_errors,
        color_disabled
      );
      app.use("/uac", route_uac);

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

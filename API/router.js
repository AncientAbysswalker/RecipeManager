const express = require("express");
const app = express();

// Load config
const config = require("./config.js");

// Retrieve Mongo Client
const mongo = require("mongodb");
const MongoClient = mongo.MongoClient;

// Use body-parser to parse the body af a request
let bodyParser = require("body-parser");
app.use(bodyParser.json());

// Log that process is starting
console.log(c_cyn("Attempting to start mongo router"));

// Parse args for process
let p_args = process.argv.slice(2);
let log_file = !p_args.includes("-nolog");

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
        try {
          // if (req.body.name === undefined || req.body.distance === undefined)
          //   throw "nonull";
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
              response.status(201).send(result.ops[0]);
            } else {
              response.status(500).send({
                message: "Internal database exception",
              });
            }
          });
        } catch (err) {
          // Switch here for errors
          response.status(400).send({
            message: "Incorrect or insufficient data in [POST] body",
          });
        }
      });

      // [GET] the full body data for all recipes - Not recommended
      app.get("/recipes", (request, response) => {
        recipes.find().toArray((err, result) => {
          if (!err) {
            response.json(result);
          } else {
            console.log("Query Error:", err);
            response.status(500).send({
              message: "Internal database exception",
            });
          }
        });
      });

      // [GET] the full body data for one recipe using its db id
      app.get("/recipes/:id", (request, response) => {
        console.log(
          `Recieved ${c_yel("[GET]")} request for id ${request.params.id}`
        );

        //trycatch HERE - see error from too-long id field!
        // Get the id in an acceptable format for mongo
        let id = new mongo.ObjectID(request.params.id);

        recipes.findOne({ _id: id }, (err, result) => {
          if (!err) {
            console.log(`${c_yel("[GET]")} request ${c_grn("successful")}\n`);
            response.json(result);
          } else {
            console.log(c_red("Query Error:"), err);
            response.status(500).send({
              message: "Internal database exception",
            });
          }
        });
      });

      //get a specific post by URL, the url is a unique index in mongodb
      app.get("/star/:name", function(req, res) {
        var name = req.params.name;
        console.log(name);
        if (typeof name == "string") {
          recipes.findOne({ name: name }, function(err, item) {
            if (!err) {
              res.json(item);
            } else {
              console.log("error", err);
            }
          });
        }
      });

      //get the posts by category
      app.get("/posts/category/:cat", function(req, res) {
        var cat = req.params.cat;
        if (typeof cat == "string") {
          recipes.find({ category: cat }).toArray(function(err, item) {
            if (!err) {
              res.json(item);
            } else {
              console.log("error", err);
            }
          });
        }
      });

      app.listen(3000, function() {
        console.log(c_grn("Mongo router successfully started on port 3000"));
        console.log(
          ` - Logging to file is currently ${
            log_file ? c_grn("enabled") : c_red("disabled")
          }\n`
        );
      });
    } else {
      console.log("Mongo router failed to start:", client_err);
    }
  }
);

// Color interrupt functions for in-console strings
function c_yel(str) {
  return `\x1b[33m${str}\x1b[0m`;
}
function c_grn(str) {
  return `\x1b[32m${str}\x1b[0m`;
}
function c_cyn(str) {
  return `\x1b[36m${str}\x1b[0m`;
}
function c_red(str) {
  return `\x1b[31m${str}\x1b[0m`;
}

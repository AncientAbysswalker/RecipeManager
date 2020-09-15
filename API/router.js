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

      // [GET] the data for all recipes, with optional filtering
      app.get("/recipes", (request, response) => {
        try {
          // Ensure that the fields will always be a list
          let fields = paramToList(request.query.fields);

          // Query mongo db
          recipes
            .find()
            .project(fields.reduce((a, b) => ((a[b] = 1), a), {}))
            .toArray((err, result) => {
              if (!err) {
                response.json(result);
              } else {
                console.log("Query Error:", err);
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

      // [GET] the data for one recipe using its db id, with optional filtering
      app.get("/recipes/:id", (request, response) => {
        console.log(
          `Recieved ${c_yel("[GET]")} request for id ${request.params.id}`
        );

        // First confirm that the id request is OK
        try {
          let id = new mongo.ObjectID(request.params.id);

          try {
            recipes.findOne({ _id: id }, (err, result) => {
              if (!err) {
                console.log(
                  `${c_yel("[GET]")} request ${c_grn("successful")}\n`
                );
                fs.appendFileSync(
                  "./log.txt",
                  stripColor(
                    `${c_yel("[GET]")} request ${c_grn("successful")}\n`
                  )
                );

                // If response is null, respond 404
                if (result !== null) {
                  response.json(result);
                } else {
                  response.status(404).send({
                    status: 404,
                    message: "The requested resource could not be found",
                  });
                }
              } else {
                console.log(c_red("Query Error:"), err);
                response.status(500).send({
                  message: "Internal database exception",
                });
              }
            });
          } catch (err) {
            console.log(err.name);
            console.log(err.message);
            console.log(err.stack);
            // Switch here for errors
            response.status(400).send({
              message: "Incorrect or insufficient data in [POST] body",
            });
          }
        } catch {
          console.log(
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
            log_file ? c_grn("enabled") : c_red("disabled")
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
function stripColor(str) {
  return str.replace(/\x1b\[[0-9]+m/g, "");
}

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

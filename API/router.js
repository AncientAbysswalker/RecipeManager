const express = require("express");
const app = express();

// Load config
const config = require("./config.js");

// Retrieve Mongo Client
const MongoClient = require("mongodb").MongoClient;

// Use body-parser to parse the body af a request
let bodyParser = require("body-parser");
app.use(bodyParser.json());

// Connect to the db and listen
MongoClient.connect(
  config.uri,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err, client) => {
    if (!err) {
      let db = client.db(config.db);
      let recipes = db.collection("stars");

      // [POST] a new recipe to the mongo db
      app.post("/stars", (req, res) => {
        try {
          if (req.body.name === undefined || req.body.distance === undefined)
            throw "nonull";
          let new_entry = {
            name: req.body.name,
            distance: req.body.distance,
          };

          recipes.insertOne(new_entry, (op_err, op_res) => {
            res.send(op_res.ops[0]);
          });
        } catch (err) {
          res.status(400).send({
            message: "Incorrect or insufficient data in [POST] body",
          });
        }
      });

      // [GET] the full body data for all recipes - Not recommended
      app.get("/stars", (req, res) => {
        recipes.find().toArray((err, items) => {
          if (!err) {
            res.json(items);
          } else {
            console.log("error", err);
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
        console.log("starting our application");
      });
    } else {
      console.log("error", err);
    }
  }
);

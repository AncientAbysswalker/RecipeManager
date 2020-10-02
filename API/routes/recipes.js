module.exports = (client, log_requests, log_errors, color_disabled) => {
  const express = require("express");
  const router = express.Router();
  const mongo = require("mongodb");

  // Load logging helper
  const log = require("../helpers/logging")(
    log_requests,
    log_errors,
    color_disabled
  );

  // Load query helpers
  const qry = require("../helpers/query_helpers");

  // Load config
  const recipes_config = require("./recipes_config");

  // Set up MongoDB variables
  let db = client.db(recipes_config.db);
  let recipes = db.collection("recipes");

  // ExpressJS Router
  router
    .post("/", (request, response) => {
      // Log request and save time of request
      let time_req = log.req_post(request.originalUrl);

      try {
        // Build new entry from request body. Any fields not included will become null
        let new_entry = {
          name: request.body.name,
          time_active: request.body.time_active,
          time_passive: request.body.time_passive,
          ingredients: request.body.ingredients,
          instructions: request.body.instructions,
          images: request.body.images,
        };

        // Insert one recipe
        recipes.insertOne(new_entry, (err, result) => {
          if (!err) {
            log.success("POST", request.originalUrl, time_req, 201);
            response.status(201).send(result.ops[0]);
          } else {
            log.fail("POST", request.originalUrl, time_req, 500, err);
            response.status(500).send({
              status: 500,
              message: "Internal database exception",
            });
          }
        });
      } catch (err) {
        log.fail("POST", request.originalUrl, time_req, 500, err);
        response.status(500).send({
          status: 500,
          message: "Internal database exception",
        });
      }
    })

    // [GET] the data for all recipes, with optional filtering
    .get("/", (request, response) => {
      // Log request and save time of request
      let time_req = log.req_get(request.originalUrl);

      try {
        // Ensure that the fields will always be a list
        let fields = qry.paramToList(request.query.fields);

        // Query mongo db
        recipes
          .find()
          .project(fields.reduce((a, b) => ((a[b] = 1), a), {}))
          .toArray((err, result_raw) => {
            // Strip result of any entries only containing _id
            let result = qry.filterEmpty(result_raw, fields.includes("_id"));

            if (!err) {
              if (result.length !== 0) {
                log.success("GET", request.originalUrl, time_req, 200);
                response.json(result);
              } else {
                log.fail(
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
              log.fail("GET", request.originalUrl, time_req, 500, err);
              response.status(500).send({
                status: 500,
                message: "Internal database exception",
              });
            }
          });
      } catch (err) {
        log.fail("GET", request.originalUrl, time_req, 500, err);
        response.status(500).send({
          status: 500,
          message: "Internal database exception",
        });
      }
    })

    // [GET] the data for one recipe using its db id, with optional filtering
    .get("/:id", (request, response) => {
      // Log request and save time of request
      let time_req = log.req_get(request.originalUrl);

      // First confirm that the id request is OK
      try {
        // Get the id in the appropriate format
        let id = new mongo.ObjectID(request.params.id);
        try {
          // Ensure that the fields will always be a list
          let fields = qry.paramToList(request.query.fields);

          recipes.findOne(
            { _id: id },
            { projection: fields.reduce((a, b) => ((a[b] = 1), a), {}) },
            (err, result) => {
              if (!err) {
                // If response is null or only the _id, respond 404
                if (result === null || Object.keys(result).length === 1) {
                  log.fail(
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
                } else {
                  log.success("GET", request.originalUrl, time_req, 200);
                  response.json(result);
                }
              } else {
                log.fail("GET", request.originalUrl, time_req, 500, err);
                response.status(500).send({
                  status: 500,
                  message: "Internal database exception",
                });
              }
            }
          );
        } catch (err) {
          log.fail("GET", request.originalUrl, time_req, 500, err);
          response.status(500).send({
            status: 500,
            message: "Internal database exception",
          });
        }

        // If the wrong number of bytes is provided
      } catch {
        log.fail(
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

  return router;
};

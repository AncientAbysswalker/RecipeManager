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
  const db_name = require("./db_config").db_name;
  const recipes_collection = require("./db_config").recipes_collection;

  // Set up MongoDB variables
  let db = client.db(db_name);
  let recipes = db.collection(recipes_collection);

  // Common functions
  function isRecipeOwnerById(request, response, next) {
    if (request.session.loggedIn && request.session.userId) {
      try {
        // Get the id in the appropriate format
        let id = new mongo.ObjectID(request.params.id);
        try {
          recipes.findOne(
            { _id: id },
            (err, result) => {
              if (!err) {
                // If response is null or only the _id, respond 404
                if (result === null) {
                  log.fail(
                    "GET",
                    request.originalUrl,
                    request.clf,
                    404,
                    "The requested resource could not be found"
                  );
                  response.status(404).send({
                    status: 404,
                    message: "The requested resource could not be found",
                  });
                } else {
                  if (request.session.userId === result.ownerId || !result.hasOwnProperty('ownerId')) {
                    next(); //If session exists, and user is authorized
                  } else {
                    log.fail("PUT", request.originalUrl, 0, 401, "User not authorized for action");
                    response.status(401).send({
                      status: 401,
                      message: "User not authorized for action",
                    });
                  }
                }
              } else {
                log.fail("GET", request.originalUrl, request.clf, 500, err);
                response.status(500).send({
                  status: 500,
                  message: "Internal database exception",
                });
              }
            }
          );
        } catch (err) {
          log.fail("GET", request.originalUrl, request.clf, 500, err);
          response.status(500).send({
            status: 500,
            message: "Internal database exception",
          });
        }

        // If the wrong number of bytes is provided
      } catch (err) {
        log.fail(
          "GET",
          request.originalUrl,
          request.clf,
          400,
          "The id provided must be a single string of 12 bytes or 24 hex characters"
        );
        response.status(400).send({
          status: 400,
          message:
            "The id provided must be a single string of 12 bytes or 24 hex characters",
        });
      }
    } else {
      log.fail("PUT", request.originalUrl, 0, 401, "No user for authorized action");
      response.status(401).send({
        status: 401,
        message: "A user is required for authorization for this action",
      });
    }
  }

  // ExpressJS Router
  router
    .post("/", log.req_post, (request, response) => {
      try {
        // Build new entry from request body. Any fields not included will become null
        let new_entry = {
          name: request.body.name,
          time_active: request.body.time_active,
          time_total: request.body.time_total,
          ingredients: request.body.ingredients,
          instructions: request.body.instructions,
          images: request.body.images,
          tags: request.body.tags,
          yield: request.body.yield,
          ownerId: request.session.loggedIn ? request.session.userId : undefined
        };

        // Insert one recipe
        recipes.insertOne(new_entry, (err, result) => {
          if (!err) {
            log.success("POST", request.originalUrl, request.clf, 201);
            response.status(201).send(result.ops[0]);
          } else {
            log.fail("POST", request.originalUrl, request.clf, 500, err);
            response.status(500).send({
              status: 500,
              message: "Internal database exception",
            });
          }
        });
      } catch (err) {
        log.fail("POST", request.originalUrl, request.clf, 500, err);
        response.status(500).send({
          status: 500,
          message: "Internal database exception",
        });
      }
    })

    // [GET] the data for all recipes, with optional filtering
    .get("/", log.req_get, (request, response) => {
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
                log.success("GET", request.originalUrl, request.clf, 200);
                response.json(result);
              } else {
                log.fail(
                  "GET",
                  request.originalUrl,
                  request.clf,
                  404,
                  "The requested resource could not be found"
                );
                response.status(404).send({
                  status: 404,
                  message: "The requested resource could not be found",
                });
              }
            } else {
              log.fail("GET", request.originalUrl, request.clf, 500, err);
              response.status(500).send({
                status: 500,
                message: "Internal database exception",
              });
            }
          });
      } catch (err) {
        log.fail("GET", request.originalUrl, request.clf, 500, err);
        response.status(500).send({
          status: 500,
          message: "Internal database exception",
        });
      }
    })

    // [GET] the data for one recipe using its db id, with optional filtering
    .get("/:id", log.req_get, (request, response) => {
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
                    request.clf,
                    404,
                    "The requested resource could not be found"
                  );
                  response.status(404).send({
                    status: 404,
                    message: "The requested resource could not be found",
                  });
                } else {
                  log.success("GET", request.originalUrl, request.clf, 200);
                  response.json(result);
                }
              } else {
                log.fail("GET", request.originalUrl, request.clf, 500, err);
                response.status(500).send({
                  status: 500,
                  message: "Internal database exception",
                });
              }
            }
          );
        } catch (err) {
          log.fail("GET", request.originalUrl, request.clf, 500, err);
          response.status(500).send({
            status: 500,
            message: "Internal database exception",
          });
        }

        // If the wrong number of bytes is provided
      } catch (err) {
        log.fail(
          "GET",
          request.originalUrl,
          request.clf,
          400,
          "The id provided must be a single string of 12 bytes or 24 hex characters"
        );
        response.status(400).send({
          status: 400,
          message:
            "The id provided must be a single string of 12 bytes or 24 hex characters",
        });
      }
    })


    // [PUT] the data for one recipe using its db id, with optional filtering
    .put("/:id", log.req_put, isRecipeOwnerById, (request, response) => {
      // First confirm that the id request is OK
      try {
        // Build new entry from request body. Any fields not included will become null
        let revised_entry = {
          name: request.body.name,
          time_active: request.body.time_active,
          time_total: request.body.time_total,
          ingredients: request.body.ingredients,
          instructions: request.body.instructions,
          images: request.body.images,
          tags: request.body.tags,
          yield: request.body.yield,
          ownerId: request.session.loggedIn ? request.session.userId : undefined
        };

        // Get the id in the appropriate format
        let id = new mongo.ObjectID(request.params.id);
        try {
          recipes.replaceOne(
            { _id: id },
            revised_entry,
            (err, result) => {
              if (!err) {
                // If response is null, no resource is found
                if (result.modifiedCount === 0) {
                  log.fail(
                    "PUT",
                    request.originalUrl,
                    request.clf,
                    404,
                    "The requested resource could not be found"
                  );
                  response.status(404).send({
                    status: 404,
                    message: "The requested resource could not be found",
                  });
                } else {
                  log.success("PUT", request.originalUrl, request.clf, 200);
                  response.json(result);
                }
              } else {
                log.fail("PUT", request.originalUrl, request.clf, 500, err);
                response.status(500).send({
                  status: 500,
                  message: "Internal database exception",
                });
              }
            }
          );
        } catch (err) {
          log.fail("PUT", request.originalUrl, request.clf, 500, err);
          response.status(500).send({
            status: 500,
            message: "Internal database exception",
          });
        }

        // If the wrong number of bytes is provided
      } catch (err) {
        log.fail(
          "PUT",
          request.originalUrl,
          request.clf,
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

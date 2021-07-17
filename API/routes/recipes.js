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

  // Load query helpers and middleware
  const qry = require("../helpers/query_helpers");
  const mdw = require("../helpers/middleware");

  // Load config
  const db_name = require("./db_config").db_name;
  const userdata_collection = require("./db_config").userdata_collection;
  const recipes_collection = require("./db_config").recipes_collection;

  // Set up MongoDB variables
  let db = client.db(db_name);
  let recipes = db.collection(recipes_collection);
  let userdata = db.collection(userdata_collection);

  // ExpressJS Router
  router
    .post("/", mdw.setReqType("POST"), log.req, (request, response) => {
      // First confirm that we have a session!
      const loggedIn = request.session.loggedIn;
      const userId = request.session.userId;

      if (loggedIn && userId) {
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
          recipes.insertOne(new_entry, (err, recipeResult) => {
            if (!err) {
              // Once the recipe is inserted, then insert a reference into the user's saved recipes
              try {
                userdata.findOne(
                  { userId: userId },
                  (err, storedUserdataResult) => {
                    if (!err) {
                      const recipeId = recipeResult.ops[0]._id.toString();

                      if (storedUserdataResult === null) { // If there are not yet any saved recipes, make it so
                        try {
                          userdata.insertOne(
                            {
                              userId: userId,
                              savedRecipes: [recipeId],
                              userCollections: {}
                            }, (err, updatedUserdataResult) => {
                              if (!err) {
                                // After saving to userdata, return recipeResult
                                log.success(
                                  request,
                                  201
                                );
                                response.status(201).send(recipeResult.ops[0]);
                              } else {
                                log.fail(
                                  request,
                                  500,
                                  err
                                );
                                response.status(500).send({
                                  status: 500,
                                  message: "Internal database exception",
                                });
                              }
                            }
                          );
                        } catch (err) {
                          log.fail(
                            request,
                            500,
                            err
                          );
                          response.status(500).send({
                            status: 500,
                            message: "Internal database exception",
                          });
                        }
                      } else { // If there ARE saved recipes, modify them
                        try {
                          // Current data
                          let savedRecipes = storedUserdataResult.savedRecipes;

                          // Add new recipe to saved recipes (there can not be clashes as unique id)
                          savedRecipes.push(recipeId);

                          // Update db
                          userdata.updateOne(
                            { userId: userId },
                            { $set: { savedRecipes: savedRecipes } },
                            (err, updatedUserdataResult) => {
                              if (!err) {
                                // After saving to userdata, return recipeResult
                                log.success(
                                  request,
                                  201
                                );
                                response.status(201).send(recipeResult.ops[0]);
                              } else {
                                log.fail(
                                  request,
                                  500,
                                  err
                                );
                                response.status(500).send({
                                  status: 500,
                                  message: "Internal database exception",
                                });
                              }
                            }
                          );
                        } catch (err) {
                          log.fail(
                            request,
                            500,
                            err
                          );
                          response.status(500).send({
                            status: 500,
                            message: "Internal database exception",
                          });
                        }
                      }
                    } else {
                      log.fail(
                        request,
                        500,
                        err
                      );
                      response.status(500).send({
                        status: 500,
                        message: "Internal database exception",
                      });
                    }
                  }
                );
              } catch (err) {
                log.fail(
                  request,
                  500,
                  err
                );
                response.status(500).send({
                  status: 500,
                  message: "Internal database exception",
                });
              }
            } else {
              log.fail(
                request,
                500,
                err
              );
              response.status(500).send({
                status: 500,
                message: "Internal database exception",
              });
            }
          });
        } catch (err) {
          log.fail(
            request,
            500,
            err
          );
          response.status(500).send({
            status: 500,
            message: "Internal database exception",
          });
        }
      } else {
        log.fail(
          request,
          401,
          "User not authorized for action"
        );
        response.status(401).send({
          status: 401,
          message: "User not authorized for action",
        });
      }
    })

    // [GET] the data for all recipes, with optional filtering
    .get("/", mdw.setReqType("GET"), log.req, (request, response) => {
      try {
        // Ensure that the fields will always be a list
        let fields = qry.paramToList(request.query.fields);

        // Query mongo db
        recipes
          .find()
          .project(qry.headerOverride(fields, (x) => x.reduce((a, b) => ((a[b] = 1), a), {})))
          .toArray((err, result_raw) => {
            // Strip result of any entries only containing _id
            let result = qry.filterEmpty(result_raw, fields.includes("_id"));

            if (!err) {
              if (result.length !== 0) {
                log.success(
                  request,
                  200
                );
                response.json(result);
              } else {
                log.fail(
                  request,
                  404,
                  "The requested resource could not be found"
                );
                response.status(404).send({
                  status: 404,
                  message: "The requested resource could not be found",
                });
              }
            } else {
              log.fail(
                request,
                500,
                err
              );
              response.status(500).send({
                status: 500,
                message: "Internal database exception",
              });
            }
          });
      } catch (err) {
        log.fail(
          request,
          500,
          err
        );
        response.status(500).send({
          status: 500,
          message: "Internal database exception",
        });
      }
    })

    // [GET] the data for one recipe using its db id, with optional filtering
    .get("/:id", mdw.setReqType("GET"), log.req, (request, response) => {
      // First confirm that the id request is OK
      try {
        // Get the id in the appropriate format
        let id = new mongo.ObjectID(request.params.id);
        try {
          // Ensure that the fields will always be a list
          let fields = qry.paramToList(request.query.fields);

          recipes.findOne(
            { _id: id },
            { projection: qry.headerOverride(fields, (x) => x.reduce((a, b) => ((a[b] = 1), a), {})) },
            (err, result) => {
              if (!err) {
                // If response is null or only the _id, respond 404
                if (result === null || Object.keys(result).length === 1) {
                  log.fail(
                    request,
                    404,
                    "The requested resource could not be found"
                  );
                  response.status(404).send({
                    status: 404,
                    message: "The requested resource could not be found",
                  });
                } else {
                  log.success(
                    request,
                    200
                  );
                  response.json(result);
                }
              } else {
                log.fail(
                  request,
                  500,
                  err
                );
                response.status(500).send({
                  status: 500,
                  message: "Internal database exception",
                });
              }
            }
          );
        } catch (err) {
          log.fail(
            request,
            500,
            err
          );
          response.status(500).send({
            status: 500,
            message: "Internal database exception",
          });
        }

        // If the wrong number of bytes is provided
      } catch (err) {
        log.fail(
          request,
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
    .put("/:id", mdw.setReqType("PUT"), log.req, mdw.isRecipeOwnerById, (request, response) => {
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
                    request,
                    404,
                    "The requested resource could not be found"
                  );
                  response.status(404).send({
                    status: 404,
                    message: "The requested resource could not be found",
                  });
                } else {
                  log.success(
                    request,
                    200
                  );
                  response.json(result);
                }
              } else {
                log.fail(
                  request,
                  500,
                  err
                );
                response.status(500).send({
                  status: 500,
                  message: "Internal database exception",
                });
              }
            }
          );
        } catch (err) {
          log.fail(
            request,
            500,
            err
          );
          response.status(500).send({
            status: 500,
            message: "Internal database exception",
          });
        }

        // If the wrong number of bytes is provided
      } catch (err) {
        log.fail(
          request,
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


    // [DELETE] the data for one recipe using its db id
    .delete("/:id", mdw.setReqType("DELETE"), log.req, mdw.isRecipeOwnerById, (request, response) => {
      // First confirm that the id request is OK
      try {
        // Get the id in the appropriate format
        let id = new mongo.ObjectID(request.params.id);
        try {
          recipes.deleteOne(
            { _id: id },
            (err, result) => {
              if (!err) {
                // If response is null or only the _id, respond 404
                if (result === null) {
                  log.fail(
                    request,
                    404,
                    "The requested resource could not be found"
                  );
                  response.status(404).send({
                    status: 404,
                    message: "The requested resource could not be found",
                  });
                } else {
                  log.success(
                    request,
                    202
                  );
                  response.status(202).json(result);
                }
              } else {
                log.fail(
                  request,
                  500,
                  err
                );
                response.status(500).send({
                  status: 500,
                  message: "Internal database exception",
                });
              }
            }
          );
        } catch (err) {
          log.fail(
            request,
            500,
            err
          );
          response.status(500).send({
            status: 500,
            message: "Internal database exception",
          });
        }

        // If the wrong number of bytes is provided
      } catch (err) {
        log.fail(
          request,
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

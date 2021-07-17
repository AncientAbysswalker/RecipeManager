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
  const mdw = require("../helpers/middleware");

  // Load config
  const db_name = require("./db_config").db_name;
  const userdata_collection = require("./db_config").userdata_collection;

  // Set up MongoDB variables
  let db = client.db(db_name);
  let userdata = db.collection(userdata_collection);

  // ExpressJS Router
  router
    // [GET] the collections data for the current session
    .get("/collections", mdw.setReqType("GET"), log.req, (request, response) => {

      // Logged in?
      const loggedIn = request.session.loggedIn;
      const userId = request.session.userId;
      if (loggedIn && userId) {
        try {
          userdata.findOne(
            { userId: userId },
            (err, result) => {
              if (!err) {
                // If response is null or only the _id, respond 404
                if (result === null) {
                  log.success(
                    request,
                    200
                  );
                  response.json({
                    userCollections: {}
                  });
                } else {
                  log.success(
                    request,
                    200
                  );
                  response.json({
                    userCollections: result.userCollections
                  });
                }
              } else {
                log.fail(request,
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
        log.success(
          request,
          200
        );
        response.json({
          userCollections: {}
        });
      }
    })

    // [PUT] the collections data for the current session
    .put("/collections", mdw.setReqType("PUT"), log.req, (request, response) => {
      // First confirm that we have a session!
      if (request.session.loggedIn && request.session.userId) {
        // Build new entry from request body. Any fields not included will become null
        const userId = request.session.userId;
        let newCollections = request.body;

        // Does the user have collections data yet?
        try {
          userdata.findOne(
            { userId: userId },
            (err, result) => {
              if (!err) {
                // If response is null make a new record (shouldn't be able to happen in future, as the record will already be make for savedRecipes)
                if (result === null) {
                  try {
                    userdata.insertOne(
                      {
                        userId: userId,
                        userCollections: newCollections
                      }, (err, result) => {
                        if (!err) {
                          log.success(
                            request,
                            200
                          );
                          response.json(result.userCollections);
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
                  try {
                    userdata.updateOne(
                      { userId: userId },
                      { $set: { userCollections: newCollections } },
                      (err, result) => {
                        if (!err) {
                          log.success(
                            request,
                            200
                          );
                          response.json(result.userCollections);
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
          401,
          "A user is required for authorization for this action"
        );
        response.status(401).send({
          status: 401,
          message: "A user is required for authorization for this action",
        });
      }
    })


    // [GET] whether a recipe id is in the session's saved recipes list or not
    .get("/saved-recipes/:id", mdw.setReqType("GET"), log.req, (request, response) => {

      // Logged in?
      const loggedIn = request.session.loggedIn;
      const userId = request.session.userId;
      if (loggedIn && userId) {
        try {
          // Get the id in the appropriate format
          //-----------------let id = new mongo.ObjectID(request.params.id);

          try {
            userdata.findOne(
              { userId: userId },
              (err, result) => {
                if (!err) {
                  // If response is null then no it is not in our saved recipes
                  if (result === null) {
                    log.success(
                      request,
                      200
                    );
                    response.json(false);
                  } else {
                    const savedRecipes = result.savedRecipes;

                    if (savedRecipes.indexOf(request.params.id) > -1) {
                      log.success(
                        request,
                        200
                      );
                      response.json(true);
                    } else {
                      log.success(
                        request,
                        200
                      );
                      response.json(false);
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
      } else {
        log.success(
          request,
          200
        );
        response.json(false);
      }
    })

    // [PUT] whether a recipe id is in the session's saved recipes list or not
    .put("/saved-recipes/:id", mdw.setReqType("PUT"), log.req, (request, response) => {
      // First confirm that we have a session!
      const loggedIn = request.session.loggedIn;
      const userId = request.session.userId;
      if (loggedIn && userId) {
        // Build new entry from request body. Any fields not included will become null
        const isToBeSaved = request.body;

        // Does the user have collections data yet?
        try {
          userdata.findOne(
            { userId: userId },
            (err, storedUserdataResult) => {
              if (!err) {
                const recipeId = request.params.id;

                // If response is null make a new record (shouldn't be able to happen in future, as the record will already be make for savedRecipes)
                if (storedUserdataResult === null) {
                  try {
                    userdata.insertOne(
                      {
                        userId: userId,
                        savedRecipes: isToBeSaved ? [recipeId] : [],
                        userCollections: {}
                      }, (err, updatedUserdataResult) => {
                        if (!err) {
                          log.success(
                            request,
                            200
                          );
                          response.status(200).send({
                            status: 200,
                            message: "Saved recipes list updated",
                          });
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
                  try {
                    // Current data
                    let savedRecipes = storedUserdataResult.savedRecipes;
                    let userCollections = storedUserdataResult.userCollections;

                    // Modify internal data
                    const savedRecipeIndex = savedRecipes.indexOf(recipeId);
                    if (isToBeSaved) {
                      if (savedRecipeIndex === -1) { // Only add a recipeId if it's not in the saved list
                        savedRecipes.push(recipeId);
                      }
                    } else {
                      if (savedRecipeIndex > -1) { // Only remove a recipeId if it's in the saved list
                        // Remove id from saved
                        savedRecipes.splice(savedRecipeIndex, 1);

                        // Remove id from any part of the collections mapping
                        Object.keys(userCollections).forEach((collectionName) => {
                          let collection = userCollections[collectionName];
                          const collectionRecipeIndex = collection.indexOf(recipeId);

                          if (collectionRecipeIndex > -1) {
                            collection.splice(collectionRecipeIndex, 1);
                          }
                        });
                      }
                    }

                    // Update db
                    userdata.updateOne(
                      { userId: userId },
                      { $set: { savedRecipes: savedRecipes } },
                      { $set: { userCollections: userCollections } },
                      (err, updatedUserdataResult) => {
                        if (!err) {
                          log.success(
                            request,
                            200
                          );
                          response.status(200).send({
                            status: 200,
                            message: "Saved recipes list updated",
                          });
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
          401,
          "A user is required for authorization for this action"
        );
        response.status(401).send({
          status: 401,
          message: "A user is required for authorization for this action",
        });
      }
    });

  return router;
};

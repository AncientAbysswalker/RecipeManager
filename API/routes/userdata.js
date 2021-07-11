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
  const userdata_collection = require("./db_config").userdata_collection;

  // Set up MongoDB variables
  let db = client.db(db_name);
  let userdata = db.collection(userdata_collection);

  // ExpressJS Router
  router
    // [GET] the collections data for the current session
    .get("/collections", log.req_get, (request, response) => {

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
                  log.success("GET", request.originalUrl, request.clf, 200);
                  response.json({
                    userCollections: {}
                  });
                } else {
                  log.success("GET", request.originalUrl, request.clf, 200);
                  response.json({
                    userCollections: result.userCollections
                  });
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
      } else {
        log.success("GET", request.originalUrl, request.clf, 200);
        response.json({
          userCollections: {}
        });
      }
    })

    // [PUT] the collections data for the current session
    .put("/collections", log.req_put, (request, response) => {
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
                          log.success("PUT", request.originalUrl, request.clf, 200);
                          response.json(result.userCollections);
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
                } else {
                  try {
                    userdata.updateOne(
                      { userId: userId },
                      { $set: { userCollections: newCollections } },
                      (err, result) => {
                        if (!err) {
                          log.success("PUT", request.originalUrl, request.clf, 200);
                          response.json(result.userCollections);
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
      } else {
        log.fail(
          "PUT",
          request.originalUrl,
          request.clf,
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

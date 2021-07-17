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
    // [GET] the data for user-saved recipes, with optional filtering
    .get("/", mdw.setReqType("GET"), log.req, (request, response) => {
      try {
        // Ensure that the fields will always be a list
        let fields = qry.paramToList(request.query.fields);

        // First confirm that we have a session!
        if (request.session.loggedIn && request.session.userId) {
          // Build new entry from request body. Any fields not included will become null
          const userId = request.session.userId;

          // Query mongo db
          userdata
            .findOne({ userId: userId },
              (err, storedUserdataResult) => {
                if (!err) {
                  // If response is null or only the _id, respond 404
                  if (storedUserdataResult === null) {
                    log.success(
                      request,
                      200
                    );
                    response.json([]);
                  } else {
                    recipes
                      .find({ _id: { $in: storedUserdataResult.savedRecipes.map((recipeId) => new mongo.ObjectID(recipeId)) } })
                      .project(qry.headerOverride(fields, (x) => x.reduce((a, b) => ((a[b] = 1), a), {})))
                      .toArray((err, recipesResult) => {
                        // Strip result of any entries only containing _id
                        let recipesResultFiltered = qry.filterEmpty(recipesResult, fields.includes("_id"));

                        if (!err) {
                          log.success(
                            request,
                            200
                          );
                          response.json(recipesResultFiltered);
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
    });

  return router;
};

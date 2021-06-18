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
  //const db_name = require("./db_config").db_name;
  //const userdata_collection = require("./db_config").userdata_collection;

  // Set up MongoDB variables
  //let db = client.db(db_name);
  //let recipes = db.collection(userdata_collection);

  // ExpressJS Router
  router
    // [GET] the data for all recipes, with optional filtering
    .post("/login", (request, response) => {
      console.log(request.body)
      const username = request.body.username;
      const password = request.body.password;

      // logic to discern authorization
      const userId = '3897804';

      request.session.username = username;
      request.session.userId = userId;
      request.session.loggedIn = true;

      request.session.username = username;
      request.session.userId = userId;

      // Respond with session
      let sessionInfo = {};
      sessionInfo.loggedIn = true;
      sessionInfo.username = username
      sessionInfo.userId = userId;
      response.json(sessionInfo);
    })

    .post("/logout", (request, response) => {
      request.session.destroy(() => {
        console.log("user logged out.")
      });
      response.status(200).json({
        status: 'Successfully logged out'
      });
    })

    // Get Session Status, and 
    .get("/session", (request, response) => {
      let sessionInfo = {};
      if (request.session && request.session.loggedIn) {
        sessionInfo.loggedIn = true;
        sessionInfo.username = request.session.username;
        sessionInfo.userId = request.session.userId;
      } else {
        sessionInfo.loggedIn = false;
      }

      response.json(sessionInfo);
    })


  return router;
};

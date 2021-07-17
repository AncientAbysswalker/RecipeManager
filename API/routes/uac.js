module.exports = (client, log_requests, log_errors, color_disabled) => {
  const express = require("express");
  const router = express.Router();
  const mongo = require("mongodb");
  const crypto = require("crypto");

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
  const users_collection = require("./db_config").users_collection;

  // Set up MongoDB variables
  let db = client.db(db_name);
  let users = db.collection(users_collection);

  // Common Functions
  function getHashedPassword(password) {
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(password).digest('base64');
    return hash;
  }

  // ExpressJS Router
  router
    // [POST] Attempt to login
    .post("/login", mdw.setReqType("LOGIN"), log.req, (request, response) => {
      const username = request.body.username;
      const password = request.body.password;
      const hashedPassword = getHashedPassword(password);

      // Grab the stored user related to this username
      users.findOne(
        { username: username },
        (err, result) => {
          if (!err) {
            // If response is null, respond 404
            if (result === null) {
              log.fail(
                request,
                401,
                "The requested user could not be found"
              );
              response.status(401).send({
                status: 401,
                message: "Invalid login",
              });
            } else {
              // Valid password?
              if (hashedPassword === result.password) {
                log.success("POST", request.originalUrl, request.clf, 200);

                const userId = result._id;
                request.session.username = username;
                request.session.userId = userId;
                request.session.loggedIn = true;

                // Respond with session
                let sessionInfo = {};
                sessionInfo.loggedIn = true;
                sessionInfo.username = username
                sessionInfo.userId = userId;

                log.success(
                  request,
                  200
                );
                response.json(sessionInfo);
              } else {
                log.fail(
                  request,
                  401,
                  "An invalid password was used"
                );
                response.status(401).send({
                  status: 401,
                  message: "Invalid login",
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
    })

    // [POST] Logout current session
    .post("/logout", mdw.setReqType("LOGOUT"), log.req, (request, response) => {
      if (request.session.loggedIn) {
        request.session.destroy(() => {
          console.log("user logged out.")
        });
        log.success(
          request,
          200
        );
        response.status(200).json({
          status: 'Successfully logged out'
        });
      } else {
        log.fail(
          request,
          400,
          "Cannot log out: Not logged in"
        );
        response.status(400).json({
          status: 'Cannot log out: Not logged in'
        });
      }
    })

    // [POST] Attempt to sign up
    .post("/signup", mdw.setReqType("SIGNUP"), log.req, (request, response) => {
      const username = request.body.username;
      const password = request.body.password;
      const email = request.body.email;
      const hashedPassword = getHashedPassword(password);

      // Check if username exists
      users.findOne(
        { username: username },
        (err, result) => {
          if (!err) {
            // If response is not null, we already have that username
            if (result !== null) {
              log.fail(
                request,
                409,
                "The requested user already exists"
              );
              response.status(409).send({
                status: 409,
                conflict: "username",
                message: "Username already exists",
              });
            } else {
              // Check if email exists
              users.findOne(
                { email: email },
                (err, result) => {
                  if (!err) {
                    // If response is not null, we already have that email in use
                    if (result !== null) {
                      log.fail(
                        request,
                        409,
                        "The requested email is already in use"
                      );
                      response.status(409).send({
                        status: 409,
                        conflict: "email",
                        message: "Email already in use",
                      });
                    } else {
                      // Valid password?
                      let newUser = {
                        username: username,
                        password: hashedPassword,
                        email: email
                      };

                      // Insert one recipe
                      users.insertOne(newUser, (err, result) => {
                        if (!err) {
                          log.success("POST", request.originalUrl, request.clf, 200);

                          // Respond with session
                          const userId = result._id;
                          request.session.username = username;
                          request.session.userId = userId;
                          request.session.loggedIn = true;

                          let sessionInfo = {};
                          sessionInfo.loggedIn = true;
                          sessionInfo.username = username
                          sessionInfo.userId = userId;
                          response.json(sessionInfo);
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
    })

    // Get Session Status
    .get("/session", mdw.setReqType("STATUS"), log.req, (request, response) => {
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

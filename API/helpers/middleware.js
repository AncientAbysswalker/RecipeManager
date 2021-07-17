// Module for middleware

// Set the typeString for the request (GET,POST,PUT,DELETE,etc)
exports.setReqType = (typeString) => {
  return function (request, response, next) {
    request.typeString = typeString;
    next();
  }
}

// Check that the recipe owner is this session before carrying out action and throw if not
exports.isRecipeOwnerById = (request, response, next) => {
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
                  request,
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
  } else {
    log.fail(
      request,
      401,
      "No user for authorized action"
    );
    response.status(401).send({
      status: 401,
      message: "A user is required for authorization for this action",
    });
  }
}

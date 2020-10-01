// Module to handle logging functions
module.exports = (log_requests, log_errors, color_disabled) => {
  const fs = require("fs");

  // Load helpers
  const c = require("./string_colors")(color_disabled);
  const clf = require("./clf");

  // Exported Module Object Definition
  let module = {};

  // Log timestamp and that a GET request is recieved to console. Return timestamp of request
  module.req_get = (request) => {
    return module.req("[GET]", request);
  };

  // Log timestamp and that a POST request is recieved to console. Return timestamp of request
  module.req_post = (request) => {
    return module.req("[POST]", request);
  };

  // Log timestamp and that request is recieved to console. Return timestamp of request
  module.req = (method, request) => {
    let clf_date = clf.date();

    console.log(clf_date);
    console.log(`Recieved ${c.yel(method)} request ${c.cyn(request)}`);

    return clf_date;
  };

  // Log an error on the console and log the data to the error log file if not disabled
  module.fail = (method, request, time_req, status, err_str) => {
    // Log to console
    console.log(`Request ${c.red("failed")} with status ${c.cyn(status)}\n`);

    // Log request to clf log file
    if (log_requests) {
      fs.appendFile(
        "./log_req.txt",
        clf.build("-", "-", time_req, method, request, status, "size"),
        () => {} // No Callback Needed
      );
    }

    // Log request to error log file
    if (log_errors) {
      fs.appendFile(
        "./log_err.txt",
        `${time_req}\n${err_str}\n\n`,
        () => {} // No Callback Needed
      );
    }
  };

  // Log a success on the console and log the data to the clf log file if not disabled
  module.success = (method, request, time_req, status) => {
    // Log to console
    console.log(
      `Request ${c.grn("successful")} with status ${c.cyn(status)}\n`
    );

    // Log request to clf log file
    if (log_requests) {
      fs.appendFile(
        "./log_req.txt",
        clf.build("-", "-", time_req, method, request, status, "size"),
        () => {} // No Callback Needed
      );
    }
  };

  // Log application options on startup to the console
  module.option = (option, bool) => {
    // Log to console
    console.log(
      `- ${option} is currently ${bool ? c.grn("enabled") : c.red("disabled")}`
    );
  };

  // Exported Module Object Return
  return module;
};

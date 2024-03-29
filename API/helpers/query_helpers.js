// Module for helpers related to querying and query responses

// Return a list, string, or null as a list, for purposes of query projection
exports.paramToList = (param) => {
  switch (typeof param) {
    case "string":
      return [param];
    case "object":
      return param;
    default:
      return [];
  }
};

// Strip a list of objects of any object that has only one key
exports.filterEmpty = (ls, override = false) => {
  return override ? ls : ls.filter((obj) => Object.keys(obj).length !== 1);
};

// Return the fields that would be hearder fields if headers are requested
exports.headerOverride = (arr, cb) => {
  if (arr.indexOf('headers') > -1) {
    return {
      name: 1,
      images: 1,
      tags: 1
    }
  } else {
    return cb(arr);
  }
}
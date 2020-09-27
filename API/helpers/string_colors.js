module.exports = (color_disabled) => {
  let module = {};

  // Return passed string with escape codes that will color the string yellow
  module.yel = (str) => {
    return color_disabled ? str : `\x1b[33m${str}\x1b[0m`;
  };

  // Return passed string with escape codes that will color the string green
  module.grn = (str) => {
    return color_disabled ? str : `\x1b[32m${str}\x1b[0m`;
  };

  // Return passed string with escape codes that will color the string cyan
  module.cyn = (str) => {
    return color_disabled ? str : `\x1b[36m${str}\x1b[0m`;
  };

  // Return passed string with escape codes that will color the string red
  module.red = (str) => {
    return color_disabled ? str : `\x1b[31m${str}\x1b[0m`;
  };

  // Return passed string stripped of any color escape codes
  module.strip = (str) => {
    return str.replace(/\x1b\[[0-9]+m/g, "");
  };

  return module;
};

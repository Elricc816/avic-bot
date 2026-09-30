const { runFun } = require("../../utils/funUtils");

module.exports = {
  name: "greyscale",
  async execute(message, args) {
    return runFun("greyscale", message, args);
  }
};

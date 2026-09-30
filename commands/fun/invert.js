const { runFun } = require("../../utils/funUtils");

module.exports = {
  name: "invert",
  async execute(message, args) {
    return runFun("invert", message, args);
  }
};

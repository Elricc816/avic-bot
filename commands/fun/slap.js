const { runFun } = require("../../utils/funUtils");

module.exports = {
  name: "slap",
  async execute(message, args) {
    return runFun("slap", message, args);
  }
};

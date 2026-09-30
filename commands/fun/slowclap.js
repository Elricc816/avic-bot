const { runFun } = require("../../utils/funUtils");

module.exports = {
  name: "slowclap",
  async execute(message, args) {
    return runFun("slowclap", message, args);
  }
};

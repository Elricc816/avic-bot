const { runFun } = require("../../utils/funUtils");

module.exports = {
  name: "clap",
  async execute(message, args) {
    return runFun("clap", message, args);
  }
};

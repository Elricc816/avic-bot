const { runFun } = require("../../utils/funUtils");

module.exports = {
  name: "cry",
  async execute(message, args) {
    return runFun("cry", message, args);
  }
};

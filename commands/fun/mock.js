const { runFun } = require("../../utils/funUtils");

module.exports = {
  name: "mock",
  async execute(message, args) {
    return runFun("mock", message, args);
  }
};

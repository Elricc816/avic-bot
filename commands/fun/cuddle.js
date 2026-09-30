const { runFun } = require("../../utils/funUtils");

module.exports = {
  name: "cuddle",
  async execute(message, args) {
    return runFun("cuddle", message, args);
  }
};

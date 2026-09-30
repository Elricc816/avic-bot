const { runFun } = require("../../utils/funUtils");

module.exports = {
  name: "dare",
  async execute(message, args) {
    return runFun("dare", message, args);
  }
};

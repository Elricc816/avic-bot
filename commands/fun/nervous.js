const { runFun } = require("../../utils/funUtils");

module.exports = {
  name: "nervous",
  async execute(message, args) {
    return runFun("nervous", message, args);
  }
};

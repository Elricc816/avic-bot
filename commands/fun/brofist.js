const { runFun } = require("../../utils/funUtils");

module.exports = {
  name: "brofist",
  async execute(message, args) {
    return runFun("brofist", message, args);
  }
};

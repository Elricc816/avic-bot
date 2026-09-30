const { runFun } = require("../../utils/funUtils");

module.exports = {
  name: "stare",
  async execute(message, args) {
    return runFun("stare", message, args);
  }
};

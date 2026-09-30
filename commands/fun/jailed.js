const { runFun } = require("../../utils/funUtils");

module.exports = {
  name: "jailed",
  async execute(message, args) {
    return runFun("jailed", message, args);
  }
};

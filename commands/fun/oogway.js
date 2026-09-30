const { runFun } = require("../../utils/funUtils");

module.exports = {
  name: "oogway",
  async execute(message, args) {
    return runFun("oogway", message, args);
  }
};

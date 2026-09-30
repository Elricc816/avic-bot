const { runFun } = require("../../utils/funUtils");

module.exports = {
  name: "drake",
  async execute(message, args) {
    return runFun("drake", message, args);
  }
};

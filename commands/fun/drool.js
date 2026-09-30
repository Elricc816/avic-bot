const { runFun } = require("../../utils/funUtils");

module.exports = {
  name: "drool",
  async execute(message, args) {
    return runFun("drool", message, args);
  }
};

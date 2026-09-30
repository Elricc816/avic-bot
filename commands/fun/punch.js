const { runFun } = require("../../utils/funUtils");

module.exports = {
  name: "punch",
  async execute(message, args) {
    return runFun("punch", message, args);
  }
};

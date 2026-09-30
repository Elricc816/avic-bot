const { runFun } = require("../../utils/funUtils");

module.exports = {
  name: "sleep",
  async execute(message, args) {
    return runFun("sleep", message, args);
  }
};

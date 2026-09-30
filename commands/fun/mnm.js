const { runFun } = require("../../utils/funUtils");

module.exports = {
  name: "mnm",
  async execute(message, args) {
    return runFun("mnm", message, args);
  }
};

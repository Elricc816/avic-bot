const { runFun } = require("../../utils/funUtils");

module.exports = {
  name: "smile",
  async execute(message, args) {
    return runFun("smile", message, args);
  }
};

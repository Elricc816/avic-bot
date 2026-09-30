const { runFun } = require("../../utils/funUtils");

module.exports = {
  name: "stop",
  async execute(message, args) {
    return runFun("stop", message, args);
  }
};

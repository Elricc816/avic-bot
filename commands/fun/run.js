const { runFun } = require("../../utils/funUtils");

module.exports = {
  name: "run",
  async execute(message, args) {
    return runFun("run", message, args);
  }
};

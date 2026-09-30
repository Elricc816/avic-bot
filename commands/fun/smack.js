const { runFun } = require("../../utils/funUtils");

module.exports = {
  name: "smack",
  async execute(message, args) {
    return runFun("smack", message, args);
  }
};

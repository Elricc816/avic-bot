const { runFun } = require("../../utils/funUtils");

module.exports = {
  name: "smug",
  async execute(message, args) {
    return runFun("smug", message, args);
  }
};

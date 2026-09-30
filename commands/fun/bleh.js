const { runFun } = require("../../utils/funUtils");

module.exports = {
  name: "bleh",
  async execute(message, args) {
    return runFun("bleh", message, args);
  }
};

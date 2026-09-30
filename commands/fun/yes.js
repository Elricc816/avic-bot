const { runFun } = require("../../utils/funUtils");

module.exports = {
  name: "yes",
  async execute(message, args) {
    return runFun("yes", message, args);
  }
};

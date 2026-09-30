const { runFun } = require("../../utils/funUtils");

module.exports = {
  name: "shy",
  async execute(message, args) {
    return runFun("shy", message, args);
  }
};

const { runFun } = require("../../utils/funUtils");

module.exports = {
  name: "huh",
  async execute(message, args) {
    return runFun("huh", message, args);
  }
};

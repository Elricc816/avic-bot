const { runFun } = require("../../utils/funUtils");

module.exports = {
  name: "roll",
  async execute(message, args) {
    return runFun("roll", message, args);
  }
};

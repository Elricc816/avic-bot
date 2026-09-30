const { runFun } = require("../../utils/funUtils");

module.exports = {
  name: "bonk",
  async execute(message, args) {
    return runFun("bonk", message, args);
  }
};

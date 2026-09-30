const { runFun } = require("../../utils/funUtils");

module.exports = {
  name: "poke",
  async execute(message, args) {
    return runFun("poke", message, args);
  }
};

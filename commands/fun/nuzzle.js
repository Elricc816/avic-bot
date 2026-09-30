const { runFun } = require("../../utils/funUtils");

module.exports = {
  name: "nuzzle",
  async execute(message, args) {
    return runFun("nuzzle", message, args);
  }
};

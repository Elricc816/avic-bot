const { runFun } = require("../../utils/funUtils");

module.exports = {
  name: "fact",
  async execute(message, args) {
    return runFun("fact", message, args);
  }
};

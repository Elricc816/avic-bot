const { runFun } = require("../../utils/funUtils");

module.exports = {
  name: "airkiss",
  async execute(message, args) {
    return runFun("airkiss", message, args);
  }
};

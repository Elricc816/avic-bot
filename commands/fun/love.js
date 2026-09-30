const { runFun } = require("../../utils/funUtils");

module.exports = {
  name: "love",
  async execute(message, args) {
    return runFun("love", message, args);
  }
};

const { runFun } = require("../../utils/funUtils");

module.exports = {
  name: "cat",
  async execute(message, args) {
    return runFun("cat", message, args);
  }
};

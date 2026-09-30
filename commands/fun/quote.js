const { runFun } = require("../../utils/funUtils");

module.exports = {
  name: "quote",
  async execute(message, args) {
    return runFun("quote", message, args);
  }
};

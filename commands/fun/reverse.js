const { runFun } = require("../../utils/funUtils");

module.exports = {
  name: "reverse",
  async execute(message, args) {
    return runFun("reverse", message, args);
  }
};

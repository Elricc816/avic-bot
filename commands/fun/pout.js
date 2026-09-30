const { runFun } = require("../../utils/funUtils");

module.exports = {
  name: "pout",
  async execute(message, args) {
    return runFun("pout", message, args);
  }
};

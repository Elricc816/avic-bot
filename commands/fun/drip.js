const { runFun } = require("../../utils/funUtils");

module.exports = {
  name: "drip",
  async execute(message, args) {
    return runFun("drip", message, args);
  }
};

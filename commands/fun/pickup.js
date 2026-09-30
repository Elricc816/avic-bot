const { runFun } = require("../../utils/funUtils");

module.exports = {
  name: "pickup",
  async execute(message, args) {
    return runFun("pickup", message, args);
  }
};

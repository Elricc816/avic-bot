const { runFun } = require("../../utils/funUtils");

module.exports = {
  name: "pet",
  async execute(message, args) {
    return runFun("pet", message, args);
  }
};

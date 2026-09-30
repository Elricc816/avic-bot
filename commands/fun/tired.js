const { runFun } = require("../../utils/funUtils");

module.exports = {
  name: "tired",
  async execute(message, args) {
    return runFun("tired", message, args);
  }
};

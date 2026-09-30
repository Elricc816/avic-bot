const { runFun } = require("../../utils/funUtils");

module.exports = {
  name: "hack",
  async execute(message, args) {
    return runFun("hack", message, args);
  }
};

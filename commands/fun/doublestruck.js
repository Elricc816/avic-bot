const { runFun } = require("../../utils/funUtils");

module.exports = {
  name: "doublestruck",
  async execute(message, args) {
    return runFun("doublestruck", message, args);
  }
};

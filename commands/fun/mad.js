const { runFun } = require("../../utils/funUtils");

module.exports = {
  name: "mad",
  async execute(message, args) {
    return runFun("mad", message, args);
  }
};

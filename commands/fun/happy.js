const { runFun } = require("../../utils/funUtils");

module.exports = {
  name: "happy",
  async execute(message, args) {
    return runFun("happy", message, args);
  }
};

const { runFun } = require("../../utils/funUtils");

module.exports = {
  name: "wave",
  async execute(message, args) {
    return runFun("wave", message, args);
  }
};

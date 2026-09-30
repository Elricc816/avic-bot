const { runFun } = require("../../utils/funUtils");

module.exports = {
  name: "blush",
  async execute(message, args) {
    return runFun("blush", message, args);
  }
};

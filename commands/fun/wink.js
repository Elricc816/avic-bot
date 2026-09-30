const { runFun } = require("../../utils/funUtils");

module.exports = {
  name: "wink",
  async execute(message, args) {
    return runFun("wink", message, args);
  }
};

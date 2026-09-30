const { runFun } = require("../../utils/funUtils");

module.exports = {
  name: "eightball",
  async execute(message, args) {
    return runFun("eightball", message, args);
  }
};

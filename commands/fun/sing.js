const { runFun } = require("../../utils/funUtils");

module.exports = {
  name: "sing",
  async execute(message, args) {
    return runFun("sing", message, args);
  }
};

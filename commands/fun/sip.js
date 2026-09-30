const { runFun } = require("../../utils/funUtils");

module.exports = {
  name: "sip",
  async execute(message, args) {
    return runFun("sip", message, args);
  }
};

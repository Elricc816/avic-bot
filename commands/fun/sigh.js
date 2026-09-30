const { runFun } = require("../../utils/funUtils");

module.exports = {
  name: "sigh",
  async execute(message, args) {
    return runFun("sigh", message, args);
  }
};

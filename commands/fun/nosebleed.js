const { runFun } = require("../../utils/funUtils");

module.exports = {
  name: "nosebleed",
  async execute(message, args) {
    return runFun("nosebleed", message, args);
  }
};

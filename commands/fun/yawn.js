const { runFun } = require("../../utils/funUtils");

module.exports = {
  name: "yawn",
  async execute(message, args) {
    return runFun("yawn", message, args);
  }
};

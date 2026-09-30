const { runFun } = require("../../utils/funUtils");

module.exports = {
  name: "yay",
  async execute(message, args) {
    return runFun("yay", message, args);
  }
};

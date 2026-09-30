const { runFun } = require("../../utils/funUtils");

module.exports = {
  name: "shrug",
  async execute(message, args) {
    return runFun("shrug", message, args);
  }
};

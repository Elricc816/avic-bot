const { runFun } = require("../../utils/funUtils");

module.exports = {
  name: "colorify",
  async execute(message, args) {
    return runFun("colorify", message, args);
  }
};

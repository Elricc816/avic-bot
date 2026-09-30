const { runFun } = require("../../utils/funUtils");

module.exports = {
  name: "sad",
  async execute(message, args) {
    return runFun("sad", message, args);
  }
};

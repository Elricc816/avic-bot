const { runFun } = require("../../utils/funUtils");

module.exports = {
  name: "facepalm",
  async execute(message, args) {
    return runFun("facepalm", message, args);
  }
};

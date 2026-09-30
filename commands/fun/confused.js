const { runFun } = require("../../utils/funUtils");

module.exports = {
  name: "confused",
  async execute(message, args) {
    return runFun("confused", message, args);
  }
};

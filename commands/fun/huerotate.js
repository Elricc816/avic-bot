const { runFun } = require("../../utils/funUtils");

module.exports = {
  name: "huerotate",
  async execute(message, args) {
    return runFun("huerotate", message, args);
  }
};

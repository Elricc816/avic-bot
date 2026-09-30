const { runFun } = require("../../utils/funUtils");

module.exports = {
  name: "peek",
  async execute(message, args) {
    return runFun("peek", message, args);
  }
};

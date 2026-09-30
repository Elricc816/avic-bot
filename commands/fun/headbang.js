const { runFun } = require("../../utils/funUtils");

module.exports = {
  name: "headbang",
  async execute(message, args) {
    return runFun("headbang", message, args);
  }
};

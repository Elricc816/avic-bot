const { runFun } = require("../../utils/funUtils");

module.exports = {
  name: "alert",
  async execute(message, args) {
    return runFun("alert", message, args);
  }
};

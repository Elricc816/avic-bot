const { runFun } = require("../../utils/funUtils");

module.exports = {
  name: "token",
  async execute(message, args) {
    return runFun("token", message, args);
  }
};

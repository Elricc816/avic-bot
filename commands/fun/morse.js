const { runFun } = require("../../utils/funUtils");

module.exports = {
  name: "morse",
  async execute(message, args) {
    return runFun("morse", message, args);
  }
};

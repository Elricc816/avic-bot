const { runFun } = require("../../utils/funUtils");

module.exports = {
  name: "tickle",
  async execute(message, args) {
    return runFun("tickle", message, args);
  }
};

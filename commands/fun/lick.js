const { runFun } = require("../../utils/funUtils");

module.exports = {
  name: "lick",
  async execute(message, args) {
    return runFun("lick", message, args);
  }
};

const { runFun } = require("../../utils/funUtils");

module.exports = {
  name: "truth",
  async execute(message, args) {
    return runFun("truth", message, args);
  }
};

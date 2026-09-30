const { runFun } = require("../../utils/funUtils");

module.exports = {
  name: "opinion",
  async execute(message, args) {
    return runFun("opinion", message, args);
  }
};

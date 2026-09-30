const { runFun } = require("../../utils/funUtils");

module.exports = {
  name: "no",
  async execute(message, args) {
    return runFun("no", message, args);
  }
};

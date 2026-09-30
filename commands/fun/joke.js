const { runFun } = require("../../utils/funUtils");

module.exports = {
  name: "joke",
  async execute(message, args) {
    return runFun("joke", message, args);
  }
};

const { runFun } = require("../../utils/funUtils");

module.exports = {
  name: "cheers",
  async execute(message, args) {
    return runFun("cheers", message, args);
  }
};

const { runFun } = require("../../utils/funUtils");

module.exports = {
  name: "biden",
  async execute(message, args) {
    return runFun("biden", message, args);
  }
};

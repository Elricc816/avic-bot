const { runFun } = require("../../utils/funUtils");

module.exports = {
  name: "sorry",
  async execute(message, args) {
    return runFun("sorry", message, args);
  }
};

const { runFun } = require("../../utils/funUtils");

module.exports = {
  name: "celebrate",
  async execute(message, args) {
    return runFun("celebrate", message, args);
  }
};

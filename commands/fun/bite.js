const { runFun } = require("../../utils/funUtils");

module.exports = {
  name: "bite",
  async execute(message, args) {
    return runFun("bite", message, args);
  }
};

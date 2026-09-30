const { runFun } = require("../../utils/funUtils");

module.exports = {
  name: "blur",
  async execute(message, args) {
    return runFun("blur", message, args);
  }
};

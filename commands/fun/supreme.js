const { runFun } = require("../../utils/funUtils");

module.exports = {
  name: "supreme",
  async execute(message, args) {
    return runFun("supreme", message, args);
  }
};

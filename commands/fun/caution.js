const { runFun } = require("../../utils/funUtils");

module.exports = {
  name: "caution",
  async execute(message, args) {
    return runFun("caution", message, args);
  }
};

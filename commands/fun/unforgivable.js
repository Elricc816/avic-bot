const { runFun } = require("../../utils/funUtils");

module.exports = {
  name: "unforgivable",
  async execute(message, args) {
    return runFun("unforgivable", message, args);
  }
};

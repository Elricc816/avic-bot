const { runFun } = require("../../utils/funUtils");

module.exports = {
  name: "surprised",
  async execute(message, args) {
    return runFun("surprised", message, args);
  }
};

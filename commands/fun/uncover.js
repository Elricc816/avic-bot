const { runFun } = require("../../utils/funUtils");

module.exports = {
  name: "uncover",
  async execute(message, args) {
    return runFun("uncover", message, args);
  }
};

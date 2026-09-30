const { runFun } = require("../../utils/funUtils");

module.exports = {
  name: "laugh",
  async execute(message, args) {
    return runFun("laugh", message, args);
  }
};

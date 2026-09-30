const { runFun } = require("../../utils/funUtils");

module.exports = {
  name: "shout",
  async execute(message, args) {
    return runFun("shout", message, args);
  }
};

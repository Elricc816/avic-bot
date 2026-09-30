const { runFun } = require("../../utils/funUtils");

module.exports = {
  name: "gun",
  async execute(message, args) {
    return runFun("gun", message, args);
  }
};

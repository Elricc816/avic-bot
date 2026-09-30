const { runFun } = require("../../utils/funUtils");

module.exports = {
  name: "hug",
  async execute(message, args) {
    return runFun("hug", message, args);
  }
};

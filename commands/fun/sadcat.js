const { runFun } = require("../../utils/funUtils");

module.exports = {
  name: "sadcat",
  async execute(message, args) {
    return runFun("sadcat", message, args);
  }
};

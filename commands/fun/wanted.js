const { runFun } = require("../../utils/funUtils");

module.exports = {
  name: "wanted",
  async execute(message, args) {
    return runFun("wanted", message, args);
  }
};

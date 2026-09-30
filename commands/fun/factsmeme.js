const { runFun } = require("../../utils/funUtils");

module.exports = {
  name: "factsmeme",
  async execute(message, args) {
    return runFun("factsmeme", message, args);
  }
};

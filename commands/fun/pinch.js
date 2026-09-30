const { runFun } = require("../../utils/funUtils");

module.exports = {
  name: "pinch",
  async execute(message, args) {
    return runFun("pinch", message, args);
  }
};

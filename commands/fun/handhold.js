const { runFun } = require("../../utils/funUtils");

module.exports = {
  name: "handhold",
  async execute(message, args) {
    return runFun("handhold", message, args);
  }
};

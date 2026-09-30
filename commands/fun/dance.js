const { runFun } = require("../../utils/funUtils");

module.exports = {
  name: "dance",
  async execute(message, args) {
    return runFun("dance", message, args);
  }
};

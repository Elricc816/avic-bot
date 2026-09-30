const { runFun } = require("../../utils/funUtils");

module.exports = {
  name: "pat",
  async execute(message, args) {
    return runFun("pat", message, args);
  }
};

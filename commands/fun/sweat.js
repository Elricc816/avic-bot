const { runFun } = require("../../utils/funUtils");

module.exports = {
  name: "sweat",
  async execute(message, args) {
    return runFun("sweat", message, args);
  }
};

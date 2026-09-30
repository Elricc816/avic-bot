const { runFun } = require("../../utils/funUtils");

module.exports = {
  name: "cool",
  async execute(message, args) {
    return runFun("cool", message, args);
  }
};

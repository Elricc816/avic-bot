const { runFun } = require("../../utils/funUtils");

module.exports = {
  name: "scared",
  async execute(message, args) {
    return runFun("scared", message, args);
  }
};

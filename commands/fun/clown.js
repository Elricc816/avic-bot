const { runFun } = require("../../utils/funUtils");

module.exports = {
  name: "clown",
  async execute(message, args) {
    return runFun("clown", message, args);
  }
};

const { runFun } = require("../../utils/funUtils");

module.exports = {
  name: "pooh",
  async execute(message, args) {
    return runFun("pooh", message, args);
  }
};

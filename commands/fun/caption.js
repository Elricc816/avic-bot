const { runFun } = require("../../utils/funUtils");

module.exports = {
  name: "caption",
  async execute(message, args) {
    return runFun("caption", message, args);
  }
};

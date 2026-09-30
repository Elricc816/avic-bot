const { runFun } = require("../../utils/funUtils");

module.exports = {
  name: "kiss",
  async execute(message, args) {
    return runFun("kiss", message, args);
  }
};

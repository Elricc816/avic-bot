const { runFun } = require("../../utils/funUtils");

module.exports = {
  name: "thumbsup",
  async execute(message, args) {
    return runFun("thumbsup", message, args);
  }
};

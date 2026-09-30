const { runFun } = require("../../utils/funUtils");

module.exports = {
  name: "showerthought",
  async execute(message, args) {
    return runFun("showerthought", message, args);
  }
};

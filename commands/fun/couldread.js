const { runFun } = require("../../utils/funUtils");

module.exports = {
  name: "couldread",
  async execute(message, args) {
    return runFun("couldread", message, args);
  }
};

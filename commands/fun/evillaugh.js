const { runFun } = require("../../utils/funUtils");

module.exports = {
  name: "evillaugh",
  async execute(message, args) {
    return runFun("evillaugh", message, args);
  }
};

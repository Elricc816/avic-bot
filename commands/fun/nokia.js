const { runFun } = require("../../utils/funUtils");

module.exports = {
  name: "nokia",
  async execute(message, args) {
    return runFun("nokia", message, args);
  }
};

const { runFun } = require("../../utils/funUtils");

module.exports = {
  name: "angrystare",
  async execute(message, args) {
    return runFun("angrystare", message, args);
  }
};

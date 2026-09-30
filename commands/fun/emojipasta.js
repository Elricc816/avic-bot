const { runFun } = require("../../utils/funUtils");

module.exports = {
  name: "emojipasta",
  async execute(message, args) {
    return runFun("emojipasta", message, args);
  }
};

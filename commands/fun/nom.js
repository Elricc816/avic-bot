const { runFun } = require("../../utils/funUtils");

module.exports = {
  name: "nom",
  async execute(message, args) {
    return runFun("nom", message, args);
  }
};

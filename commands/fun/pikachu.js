const { runFun } = require("../../utils/funUtils");

module.exports = {
  name: "pikachu",
  async execute(message, args) {
    return runFun("pikachu", message, args);
  }
};

const { runFun } = require("../../utils/funUtils");

module.exports = {
  name: "whowouldwin",
  async execute(message, args) {
    return runFun("whowouldwin", message, args);
  }
};

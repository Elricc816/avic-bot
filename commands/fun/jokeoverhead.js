const { runFun } = require("../../utils/funUtils");

module.exports = {
  name: "jokeoverhead",
  async execute(message, args) {
    return runFun("jokeoverhead", message, args);
  }
};

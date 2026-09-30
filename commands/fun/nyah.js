const { runFun } = require("../../utils/funUtils");

module.exports = {
  name: "nyah",
  async execute(message, args) {
    return runFun("nyah", message, args);
  }
};

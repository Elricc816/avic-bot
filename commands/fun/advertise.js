const { runFun } = require("../../utils/funUtils");

module.exports = {
  name: "advertise",
  async execute(message, args) {
    return runFun("advertise", message, args);
  }
};

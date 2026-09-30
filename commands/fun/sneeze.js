const { runFun } = require("../../utils/funUtils");

module.exports = {
  name: "sneeze",
  async execute(message, args) {
    return runFun("sneeze", message, args);
  }
};

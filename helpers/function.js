const bcrypt = require("bcrypt");

module.exports = {
  generatePassword: async (password) => {
    return await bcrypt.hash(password, 10);
  },
  validPassport: async (password, dbPassword) => {
    return await bcrypt.compare(password, dbPassword);
  },
};

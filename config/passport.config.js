const LocalStrategy = require("passport-local").Strategy;
const passport = require("passport");
const sql = require("./db.config");
const { validPassport } = require("../helpers/function");

const customFields = {
  usernameField: "email",
  passwordField: "password",
};

const strategy = new LocalStrategy(customFields, (email, password, done) => {
  sql.query(`SELECT * FROM users WHERE email='${email}'`, async (_, res) => {
    try {
      const result = res[0];

      if (!result) return done(null, false);

      const isValid = await validPassport(password, result.password);

      if (isValid) {
        return done(null, result);
      } else {
        return done(null, false);
      }
    } catch (err) {
      return done(err);
    }
  });
});

passport.use(strategy);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((userId, done) => {
  sql.query(`SELECT * FROM users WHERE id='${userId}'`, (error, results) => {
    if (error) return done(error);

    console.log(results);

    done(null, results[0]);
  });
});

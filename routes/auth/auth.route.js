const express = require("express");
const passport = require("passport");
const sql = require("../../config/db.config");
const { generatePassword } = require("../../helpers/function");
const { body, validationResult } = require("express-validator");
const router = express.Router();
require("../../config/passport.config");

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/auth/login",
    successRedirect: "/dashboard",
  })
);

router.post(
  "/register",
  body("email").trim().notEmpty().isEmail(),
  body("password")
    .trim()
    .notEmpty()
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minSymbols: 1,
      minNumbers: 1,
    })
    .withMessage(
      `Error: The password does not meet the required strength criteria. Please make sure it meets the following requirements:
        Minimum length: 8 characters
        Minimum of 1 lowercase letter
        Minimum of 1 uppercase letter
        Minimum of 1 special symbol
        Minimum of 1 numeric digit`
    ),
  async (req, res) => {
    try {
      const result = validationResult(req);

      if (result.isEmpty()) {
        const password = await generatePassword(req.body.password);

        sql.query(
          `INSERT INTO users (email, password) VALUES ('${req.body.email}', '${password}')`,
          (error, results) => {
            if (error) return res.status(500).send(error.sqlMessage);

            if (results.affectedRows) {
              res.send("Success");
            } else {
              res.status(500).send("An error occrured");
            }
          }
        );
        return;
      }

      res.send({ errors: result.array({ onlyFirstError: true }) });
    } catch (error) {
      throw error;
    }
  }
);

router.post("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) return next(err);

    res.send("Success");
  });
});

module.exports = router;

const express = require("express");
const app = express();
const session = require("express-session");
const passport = require("passport");
require("./config/passport.config");

const authRoutes = require("./routes/auth/auth.route");
const pageRoutes = require("./routes/pages/pages.route");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "iu889918uufj73jhjfu3j88j3jf83",
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRoutes);
app.use("/dashboard", pageRoutes);

app.listen(9000);

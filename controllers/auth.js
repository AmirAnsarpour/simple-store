const bcrypt = require("bcryptjs");
const User = require("../models/user");

exports.getLogin = (req, res) => {
  res.render("auth/login", {
    pageTitle: "Login",
    path: "/login",
    isAuth: req.session.isLoggedIn,
  });
};

exports.postLogin = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email: email }).then((user) => {
    if (!user) {
      return res.redirect("/login");
    }

    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        req.session.isLoggedIn = true;
        req.session.user = user;
        return req.session.save((err) => {
          console.log(err);
          res.redirect("/");
        });
      }
      res.redirect("/login");
    });
  });
};

exports.postLogout = (req, res) => {
  req.session.destroy((err) => {
    // console.log(err);
    res.redirect("/");
  });
};

exports.getSignup = (req, res) => {
  res.render("auth/signup", {
    pageTitle: "Signup",
    path: "/signup",
    isAuth: req.session.isLoggedIn,
  });
};

exports.postSignup = (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email })
    .then((userDoc) => {
      if (userDoc) {
        return res.redirect("/signup");
      }
      return bcrypt.hash(password, 12).then((hashedPass) => {
        const user = new User({
          name: name,
          email: email,
          password: hashedPass,
          cart: { item: [] },
        });
        return user.save();
      });
    })
    .then(() => {
      return res.redirect("/login");
    })
    .catch((err) => {
      console.log(err);
    });
};

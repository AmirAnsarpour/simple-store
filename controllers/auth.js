const User = require("../models/user");

exports.getLogin = (req, res) => {
  res.render("auth/login", {
    pageTitle: "Login",
    path: "/login",
    isAuth: req.session.isLoggedIn,
  });
};

exports.postLogin = (req, res) => {
  User.findById("66409666553feefac4540310").then((user) => {
    req.session.user = user;
    req.session.isLoggedIn = true;
    req.session.save((err) => {
      // console.log(err);
      res.redirect("/");
    });
  });
};

exports.postLogout = (req, res) => {
  req.session.destroy((err) => {
    // console.log(err);
    res.redirect("/");
  });
};

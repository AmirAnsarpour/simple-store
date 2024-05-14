exports.getLogin = (req, res) => {
  res.render("auth/login", {
    pageTitle: "Login",
    path: "/login",
    isAuth: req.session.isLoggedIn,
  });
};

exports.postLogin = (req, res) => {
  // req.isLoggedIn = true;
  // res.setHeader("Set-Cookie", "loggedIn=true");
  req.session.isLoggedIn = true;
  res.redirect("/");
};

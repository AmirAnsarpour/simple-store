const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const User = require("./models/user");

const PORT = 3003;
const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  User.findById("66409666553feefac4540310")
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

mongoose
  .connect("mongodb://localhost/Shop")
  .then((result) => {
    User.findOne().then((user) => {
      if (!user) {
        const newUser = new User({
          name: "Amir",
          email: "amir.ansarpour2003@gmail.com",
          cart: {
            items: [],
          },
        });
        newUser.save();
      }
    });
    app.listen(PORT, () => {
      console.log(`Running on port ${PORT}`);
    });
  })
  .catch((err) => console.log(err));

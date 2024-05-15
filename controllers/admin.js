const Product = require("../models/product");

exports.getProducts = (req, res) => {
  Product.find()
    .then((products) => {
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
      });
    })
    .catch((err) => console.log(err));
};

exports.getAdmin = (req, res) => {
  res.render("admin", {
    path: "/admin",
    pageTitle: "Admin Page",
  });
};

exports.getAddProduct = (req, res) => {
  res.render("admin/add-product", {
    path: "/admin/add-product",
    pageTitle: "Add Product",
    editing: false,
  });
};

exports.postAddProduct = (req, res) => {
  const title = req.body.title;
  const price = req.body.price;
  const imageURL = req.body.imageURL;
  const description = req.body.description;

  const newProduct = new Product({
    title: title,
    price: price,
    imageURL: imageURL,
    description: description,
    userId: req.user,
  });
  newProduct
    .save()
    .then((result) => {
      console.log("Created Product");
      res.redirect("/");
    })
    .catch((err) => {
      console.error("Error creating product:", err);
      res.status(500).send("Error creating product");
    });
};

exports.getEditProduct = (req, res) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }
  const prodID = req.params.productID;
  Product.findById(prodID)
    .then((product) => {
      if (!product) {
        return res.redirect("/");
      }
      res.render("admin/add-product", {
        pageTitle: `Edit "${product.title}"`,
        path: "/admin/edit-product",
        editing: editMode,
        product: product,
      });
    })
    .catch((err) => console.log(err));
};

exports.postEditProduct = (req, res) => {
  const prodID = req.body.productID;
  const titleUD = req.body.title;
  const priceUD = req.body.price;
  const imageURLUD = req.body.imageURL;
  const descriptionUD = req.body.description;
  Product.findById(prodID)
    .then((product) => {
      product.title = titleUD;
      product.price = priceUD;
      product.imageURL = imageURLUD;
      product.description = descriptionUD;
      return product.save();
    })
    .then((result) => {
      console.log("updated Product...");
      res.redirect("/admin/products");
    });
};

exports.postDeleteProduct = (req, res) => {
  const prodID = req.body.productID;
  Product.findByIdAndDelete(prodID)
    .then(() => {
      console.log(`Product Delete`);
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
};

const Product = require("../models/product");
const Order = require("../models/order");

exports.getIndex = (req, res) => {
  Product.find()
    .then((products) => {
      res.render("shop/index", {
        path: "/",
        pageTitle: "Shop",
        prods: products,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getProduct = (req, res) => {
  const prodID = req.params.productID;
  Product.findById(prodID)
    .then((product) => {
      res.render("shop/product-details", {
        product: product,
        pageTitle: product.title,
        path: "/products",
      });
    })
    .catch((err) => console.log(err));
};

exports.getIndexs = (req, res) => {
  Product.find()
    .then((products) => {
      res.render("shop/products", {
        path: "/products",
        pageTitle: "Products",
        prods: products,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postCart = (req, res) => {
  const prodID = req.body.productID;

  Product.findById(prodID).then((product) => {
    req.user.addToCart(product);
    res.redirect("/cart");
  });
};

exports.getCart = async (req, res) => {
  const userProducts = await req.user.populate("cart.items.productId");
  res.render("shop/cart", {
    pageTitle: "Cart",
    path: "/cart",
    products: userProducts.cart.items,
  });
};

exports.postCartDeleteProduct = (req, res) => {
  const prodID = req.body.productID;
  req.user
    .removeFromCart(prodID)
    .then((result) => {
      console.log(result);
      res.redirect("/cart");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postOrder = (req, res) => {
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      const products = user.cart.items.map((item) => {
        return {
          quantity: item.quantity,
          product: { ...item.productId._doc },
        };
      });
      const order = new Order({
        user: {
          name: req.user.name,
          userId: req.user,
        },
        products: products,
      });
      return order.save();
    })
    .then(() => {
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect("/orders");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getOrder = (req, res) => {
  Order.find({ "user.userId": req.user._id })
    .then((orders) => {
      console.log(orders);
      res.render("shop/orders", {
        pageTitle: "Orders",
        path: "/orders",
        orders: orders,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

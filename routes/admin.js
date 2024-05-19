const express = require("express");
const router = express.Router();
const isAuth = require("../middleware/is-auth");

const adminController = require("../controllers/admin");

router.get("/", isAuth, adminController.getAdmin);

router.get("/add-product", isAuth, adminController.getAddProduct);
router.post("/add-product", isAuth, adminController.postAddProduct);

router.get("/products", isAuth, adminController.getProducts);

router.get("/edit-product/:productID", isAuth, adminController.getEditProduct);

router.post("/edit-product", isAuth, adminController.postEditProduct);

router.post("/delete-product", isAuth, adminController.postDeleteProduct);

module.exports = router;

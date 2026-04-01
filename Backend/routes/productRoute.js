const express = require("express");
const router = express.Router();

const { createProduct, getProducts, getProductsById, updateProduct, deleteProduct } = require("../controllers/productController");
const { isAuthenticated } = require("../middlewares/authMiddleware");
const { isAdmin } = require("../middlewares/admin");

// Get all products
router.get("/",getProducts);

//Get product By ID
router.get("/:id", getProductsById);

// Add new product by admin
router.post("/add", isAuthenticated, isAdmin, createProduct);

//Update product
router.put("/update/:id",isAuthenticated, isAdmin, updateProduct);

//Delete Product
router.delete("/delete/:id", isAuthenticated, isAdmin, deleteProduct);


module.exports = router;
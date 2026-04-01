const express = require("express");
const { addToCart, getUserCart, updateUserCart, deleteUserCartItem } = require("../controllers/cartController");
const { isAuthenticated } = require("../middlewares/authMiddleware.js");
const router = express.Router();


// Add to cart
router.post("/add", isAuthenticated, addToCart);


// get user cart
router.get("/", isAuthenticated, getUserCart);

//update cart
router.put("/update/:id", isAuthenticated, updateUserCart);

//delete cart item
router.delete("/remove/:id", isAuthenticated, deleteUserCartItem);



module.exports = router;
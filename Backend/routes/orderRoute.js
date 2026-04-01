const express = require("express");
const { checkout, getUserOrders, getOrderById, cancelOrder, updateOrderStatus, getAllOrders } = require("../controllers/orderController");
const { isAuthenticated } = require("../middlewares/authMiddleware.js");
const { isAdmin } = require("../middlewares/admin.js");
const router = express.Router();


// order items
router.post("/checkout",isAuthenticated, checkout);

// Get user orderes
router.get("/", isAuthenticated, getUserOrders);

//get all users orders
router.get("/users/order", isAuthenticated, isAdmin, getAllOrders);

//Get Order by ID 
router.get("/:id", isAuthenticated, getOrderById);

// cancel user order
router.patch("/cancel/:id",isAuthenticated, cancelOrder);

//update User status by admin
router.patch("/:id/status", isAuthenticated, isAdmin, updateOrderStatus);


module.exports = router;
const express = require("express");
const router = express.Router();

const { getAllUsers, registerUser, loginUser, getUserProfile, updateUserProfile, updatePassword, logout } = require("../controllers/userController.js");
const {isAuthenticated } = require("../middlewares/authMiddleware.js");




// register user
router.post("/register",registerUser);

//login user
router.post("/login",loginUser);

//logout user
router.post("/logout",isAuthenticated,logout);

//get user profile who is loged in
router.get("/profile",isAuthenticated ,getUserProfile);

// Get all users
router.get("/users", getAllUsers);

// update user profile by loged in user
router.put("/update",isAuthenticated, updateUserProfile);

// change password
router.put("/update/password", isAuthenticated, updatePassword);

module.exports = router;
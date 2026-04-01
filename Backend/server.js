const express = require("express");
const db = require("./config/db.js");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();
require("dotenv").config();

app.use(cors());
app.use(express.json());
app.use(cookieParser());


const userRoute = require("./routes/userRoute.js");
const productRoute = require("./routes/productRoute.js");
const cartRoute = require("./routes/cartRoute.js");
const orderRoute = require("./routes/orderRoute.js");


app.use('/api/users', userRoute);
app.use('/api/products', productRoute);
app.use("/api/cart", cartRoute);
app.use("/api/orders", orderRoute);

app.get("/",(req,res) => {
    res.send("Backend Grocerio Home Page");
});

app.listen(3000,() => {
    console.log("Server is running on Port : " , 3000);
});
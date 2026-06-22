const express = require("express");
const db = require("./config/db.js");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();
const port = 3000;
require("dotenv").config();

app.use(cors({
    origin : process.env.BASE_URI,
    credentials : true
}));


app.use(express.urlencoded({extended:true}));
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

app.listen(port,() => {
    console.log("Server is running on Port : " , port);
});
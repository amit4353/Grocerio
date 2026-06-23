const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();
require("dotenv").config();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://grocerio-beryl.vercel.app",
  "https://grocerio-he93tcs5f-amit-prajapati-s-projects.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

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

const port = process.env.PORT || 3000;

app.listen(port,() => {
    console.log("Server is running on Port : " , port);
});
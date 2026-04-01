const mysql = require("mysql2");

const db = mysql.createConnection({
    host : "localhost",
    user : "root",
    password : "Amit@123",
    database : "grocerio",
});

db.connect((err) => {
    if(err){
        console.log(err);
    } else {
        console.log("Database connected successfully 🥳");
    }
})

module.exports = db;
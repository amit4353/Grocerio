const db = require("../config/db.js");
const claudinary = require("../config/cloudinary.js");


exports.getProducts = (req,res) => {
    try{
        const sql = "SELECT * FROM products";
        db.query(sql, (err,result) => {
            if(err) {
                return res.status(404).json(err);
            }
            res.json(result);
        })
        
    } catch(err){
        return res.status(500).json({
            message : "Internal Servar Error"
        })
    }
}

exports.getProductsById = (req,res) => {
    try {
        const { id } = req.params;
        const sql = "SELECT * FROM products WHERE id = ?";
        
        db.query(sql,[id],(err, result) => {
            if(err){
                return res.status(500).json(err);
            }
            
            if(result.length === 0){
                return res.status(404).json({
                    message : "Product not found!"
                })
            }
            res.json(result[0]);
        })
        
    } catch(err){
        return res.status(500).json({
            message : "Internal Server Error"
        })
    }
}

exports.createProduct = (req, res) => {
    try {
        const {name, brand, price, image, description, stock} = req.body;

        if(!name || !brand || !price || !image || !description){
            return res.status(400).json({
                message : "All fields are required"
            });
        };

        if(!name || !brand || !price || !image || !description){
            return res.status(400).json({
                message : "All fields are required"
            });
        };

        const sql = "INSERT INTO products (name, brand, price, image, description, stock) VALUE (?,?,?,?,?,?)";

        db.query(sql,[name, brand, price, image, description, stock || 0], (err, result) => {
            if(err){
                return res.status(500).json(err);
            }
            
            res.status(201).json({
                message : "Product Created successfully",
                productId : result.insertId,
                data : result
            })
        })

    } catch (err) {
        return res.status(500).json({
            message : "Internal Servar Error"
        })
    }
}

exports.updateProduct = (req, res) => {
    const { id } = req.params;

    db.query("SELECT * FROM products WHERE id=?", [id], (err, product) => {

        if(err) return res.status(404).json(err);

        if(product.length === 0){
            return res.status(404).json({
                message : "Product not found"
            });
        };

        const {name , brand, price, image, description, stock } = req.body;
        
        const sql = "UPDATE products SET name = COALESCE(?, name), brand = COALESCE(?, brand), price = COALESCE(?, price), image = COALESCE(?, image), description = COALESCE(?, description), stock = COALESCE(?, stock) WHERE id=?";
        
        const values = [
            name || null,
            brand || null,
            price || null,
            image || null,
            description || null,
            stock ?? null,
            id
        ];
        
        db.query(sql,values, (err, result) => {
            if(err){
                return res.status(500).json(err);
            }
            res.json({
                message : "Product Updated successfully",
                product : result[0]
            })
        });
    });
}

exports.deleteProduct = (req, res) => {
    const { id } = req.params;

    db.query("SELECT * FROM products WHERE id=?", [id], (err, product) => {
        if(err){
            return res.status(500).json(err);
        }
        if(product.length === 0){
            return res.status(404).json({
                message : "Product not found"
            })
        }

        db.query("DELETE FROM products WHERE id=?", [id], (err,result) => {
            if(err) return res.status(500).json(err);
            res.status(200).json({
                message : "Delete Product successfully",
                deletedProduct : product[0]
            })
        })
    })
}


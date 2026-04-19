const db = require("../config/db.js");
const cloudinary = require("../config/cloudinary.js");


exports.getProducts = (req,res) => {
    try{
        const sql = "SELECT * FROM products";
        db.query(sql, (err,result) => {
            if(err) {
                return res.status(500).json(err);
            }
            res.json(result);
        })
        
    } catch(err){
        return res.status(500).json({
            message : "Internal Server Error"
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

        console.log("BODY:", req.body);
        console.log("FILE:", req.file);
        
        if(!req.file){
            return res.status(400).json({
                message : "Image is required"
            })
        }
        
        const {name, brand, price, description, stock} = req.body;
        const image = req.file.path;
        const cloudinary_id = req.file.filename;

        if(!name || !brand || !price || !description){
            return res.status(400).json({ message: "All fields are required" });
        }

        if(isNaN(price)){
            return res.status(400).json({ message: "Price must be a number" });
        }

        const sql = "INSERT INTO products (name, brand, price, image, description, cloudinary_id, stock) VALUES (?,?,?,?,?,?,?)";

        db.query(sql,[name, brand, price, image, description, cloudinary_id, stock || 0], (err, result) => {
            if(err){
                return res.status(500).json(err);
            }
            res.status(201).json({
                message : "Product Created successfully",
                productId : result.insertId,
                result
            })
        })


    } catch (err) {
        return res.status(500).json({
            message : "Internal Server Error"
        })
    }
}


exports.updateProduct = (req, res) => {
    const { id } = req.params;

    db.query("SELECT * FROM products WHERE id=?", [id], async (err, product) => {

        if(err) return res.status(500).json(err);

        if(product.length === 0){
            return res.status(404).json({
                message : "Product not found"
            });
        };

        let image =  product[0].image;
        let cloudinary_id = product[0].cloudinary_id;

        if(req.file){
            if(cloudinary_id){
                try {
                    await cloudinary.uploader.destroy(cloudinary_id);
                } catch(err) {
                    console.log("Cloudinary delete error:", err);
                }
            }

            image = req.file.path;
            cloudinary_id = req.file.filename;        
        }

        const {name , brand, price, description, stock } = req.body;
        
        
        const sql = `UPDATE products SET
            name = COALESCE(?, name),
            brand = COALESCE(?, brand),
            price = COALESCE(?, price),
            image = ?,
            cloudinary_id = ?,
            description = COALESCE(?, description),
            stock = COALESCE(?, stock)
            WHERE id=?`
        ;
        
        const values = [
            name || null,
            brand || null,
            price || null,
            image,
            cloudinary_id,
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
            })
        });
    });
}

exports.deleteProduct = (req, res) => {
    const { id } = req.params;

    db.query("SELECT * FROM products WHERE id=?", [id], async (err, product) => {
        if(err){
            return res.status(500).json(err);
        }
        if(product.length === 0){
            return res.status(404).json({
                message : "Product not found"
            })
        }

        if(product[0].cloudinary_id){
            try {
                await cloudinary.uploader.destroy(product[0].cloudinary_id);
            } catch (err) {
                console.log("Cloudinary delete error:", err);
            }
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


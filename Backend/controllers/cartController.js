const db = require("../config/db.js");

exports.addToCart = (req, res) => {
    const userId = req.user.id;

    const {product_id, quantity} = req.body;

    if(!product_id){
        return res.status(400).json({
            message : "Product id is required"
        })
    }

    db.query("SELECT * FROM products WHERE id = ? " ,[ product_id ], (err,product) => {
        if(err) return res.status(500).json(err);

        if(product.length === 0){
            return res.status(404).json({
                message : "Product Not found!"
            })
        }

        if(product[0].stock <= 0){
            return res.status(400).json({
                message : "Product is out of stock!"
            })
        }

        const requestedQty = quantity || 1;
        if(requestedQty > product[0].stock){
            return res.status(400).json({
                message : `Only ${product[0].stock} items available in stock`
            })
        }

        db.query("SELECT * FROM cart WHERE user_id = ? AND product_id = ?", [userId, product_id] , (err, cartItem) => {
            if(err) return res.status(500).json(err);

            if(cartItem.length > 0){
                db.query("UPDATE cart SET quantity = quantity + ? WHERE id = ?",[quantity || 1, cartItem[0].id], (err) => {
                    if(err) return res.status(500).json(err);

                    res.status(200).json({
                        message : "Product added to cart"
                    })
                })

            } else {

                db.query("INSERT INTO cart (user_id, product_id, quantity) VALUES( ? , ? ,? )", [userId, product_id, quantity || 1], (err) => {
                    if(err) return res.status(500).json(err);
                    res.status(201).json({
                        message : "Product Added to cart",
                        product : product
                    });
                })
            }
        })
    });
};

exports.getUserCart = (req, res) => {
    const userId = req.user.id;
    
    const sql = "SELECT cart.id, products.name, products.image, products.price, products.stock, cart.quantity FROM cart JOIN products ON cart.product_id = products.id WHERE cart.user_id = ?";

    db.query(sql, [userId], (err, result) => {
        if(err) return res.status(500).json(err);
        res.json(result);
    })
}

exports.updateUserCart = (req, res) => {
    const { id } = req.params;
    const { quantity } = req.body;

    if(quantity === undefined || quantity < 0){
        return res.status(400).json({
            message : "Valid quantity required min(1)"
        })
    }

    const sql = "UPDATE cart SET quantity = ? WHERE id = ?";

    db.query(sql, [quantity , id] , (err, result) => {

        if(err) return res.status(500).json(err);

        if(result.affectedRows === 0){
            return res.status(404).json({
                message : "Cart item not found!"
            })
        }

        res.json({
            message : "Cart updated successfully!",
            product : result
        })
    });
};


exports.deleteUserCartItem = (req, res) => {
    const { id } = req.params;

    db.query("DELETE FROM cart WHERE id = ?", [id], (err, item) => {
        if(err) return res.status(500).json(err);

        if(item.affectedRows === 0){
            return res.status(404).json({
                message : "Product item not found"
            })
        }
        res.json({
            message : "Product removed from cart",
            item
        })
    })
}

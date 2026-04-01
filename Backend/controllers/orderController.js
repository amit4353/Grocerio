const db = require("../config/db.js");

exports.checkout = (req, res) => {
    const userId = req.user.id;

    const cartQuery = `SELECT cart.product_id, cart.quantity, products.price, products.stock 
                    FROM cart JOIN products ON cart.product_id = products.id WHERE cart.user_id = ?
    `;

    db.query(cartQuery, [userId], (err, cartItems) => {
        if(err) return res.status(500).json(err);

        // Cart empty check
        if(cartItems.length === 0){
            return res.status(404).json({
                message: "Cart is empty"
            });
        }

        //  Stock check 
        for(let item of cartItems){
            if(item.quantity > item.stock){
                return res.status(400).json({
                    message: "Insufficient stock for one or more products"
                });
            }
        }

        // Total price calculate
        let totalPrice = 0;
        cartItems.forEach((item) => {
            totalPrice += (item.price * item.quantity);
        });

        db.query("INSERT INTO orders (user_id, total_price) VALUES (?,?)", [userId, totalPrice], (err, result) => {
            if(err) return res.status(500).json(err);

            const orderId = result.insertId;

            const value = cartItems.map((item) => [
                orderId,
                item.product_id,
                item.quantity,
                item.price
            ]);


            db.query("INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ?", [value], (err, result) => {
                if(err) return res.status(500).json(err);


                let i = 0;

                function updateStock() {


                    if(i === cartItems.length){


                        db.query("DELETE FROM cart WHERE user_id = ?", [userId], (err, deletedData) => {
                            if(err) return res.status(500).json(err);


                            return res.json({
                                message: "Order placed successfully",
                                orderId,
                                DeletedData: deletedData
                            });
                        });
                        return;
                    }

                    const item = cartItems[i]; // current item

                    db.query("UPDATE products SET stock = stock - ? WHERE id = ?",
                        [item.quantity, item.product_id],
                        (err) => {
                            if(err) return res.status(500).json(err);
                            i++;             
                            updateStock(); 
                        }
                    );
                }

                updateStock();
            });
        });
    });
};


// get all orders of users
exports.getUserOrders = (req, res) => {
    const userId = req.user.id;
    const sql = `SELECT orders.id AS order_id,
        orders.status,
        products.name,
        products.description, 
        order_items.quantity, 
        order_items.price,
        orders.total_price,
        products.image
        FROM orders
        JOIN order_items ON orders.id = order_items.order_id
        JOIN products ON products.id = order_items.product_id
        WHERE orders.user_id = ?`
    ; 
        
    db.query(sql, [userId], (err, orders) => {

        if(err) return res.status(500).json(err);
        if(orders.length === 0){
            return res.status(404).json({
                message : "Order Not Found!"
            })
        }
        return res.status(200).json({
            message : "Order fetched successfully",
            data : orders
        })
    });
}

//get order by id
exports.getOrderById = (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    const sql = `SELECT orders.id AS order_id,
        products.name,
        products.brand, 
        orders.status, 
        products.description, 
        order_items.quantity, 
        order_items.price, 
        orders.total_price, 
        products.image 
        
        FROM orders 
        JOIN order_items ON orders.id = order_items.order_id 
        JOIN products ON order_items.product_id = products.id 
        WHERE orders.id = ? AND orders.user_id = ?`
    ;

    db.query(sql  , [id, userId] , (err, order) => {
        if(err) return res.status(500).json(err);

        if(order.length === 0){
            return res.status(404).json({
                message : "Order Not Found!"
            })
        }

        return res.status(200).json({
            message : "Order fetched successfully",
            order : order
        })
    })

}

// cancel user status
exports.cancelOrder = (req, res) => {
    const userId = req.user.id;
    const orderId = req.params.id;

    db.query("SELECT status FROM orders WHERE id = ? AND user_id = ?" , [orderId, userId] , (err,order) => {
        if(err) return res.status(500).json(err);
        if(order.length === 0){
            return res.status(404).json({
                message : "Order not found!",
            })
        }

        if(order[0].status === 'cancelled'){
            return res.status(400).json({
                message : "Order already cancelled"
            })
        }

        if(order[0].status === 'delivered'){
            return res.status(400).json({
                message : "Order cannot be cancelled"
            })    
        }

        db.query("UPDATE orders SET status ='cancelled' WHERE id = ? ", [orderId] , (err) => {
            if(err) return res.status(500).json(err);

            db.query("SELECT product_id, quantity FROM order_items WHERE order_id = ?", [orderId], (err, items) => {
                if(err) return res.status(500).json(err);

                let i = 0;
                function restoreStock() {
                    if(i === items.length){
                        return res.status(200).json({
                            message: "Order cancelled successfully!"
                        });
                    }

                    const item = items[i];

                    db.query("UPDATE products SET stock = stock + ? WHERE id = ?",
                        [item.quantity, item.product_id],
                        (err) => {
                            if(err) return res.status(500).json(err);
                            i++;
                            restoreStock();
                        }
                    );
                }
                restoreStock();
            });
        });
    });
};


// Update user order status by admin
exports.updateOrderStatus = (req, res) => {
    const orderId = req.params.id;
    const { status } = req.body;

    const validStatuses = ['pending','confirmed','shipped','delivered','cancelled'];

    if(!validStatuses.includes(status)){
        return res.status(400).json({
            message : "Invalid status value"
        })
    }

    if(status === "cancelled"){
        return res.status(400).json({
            message : "You can't cancel users Order"
        })
    };

    db.query("SELECT status FROM orders WHERE id = ?",[orderId], (err, result) => {
        if(err) return res.status(500).json(err);

        if(result.length === 0){
            return res.status(404).json({
                message : "Order not found!"
            })
        }

        if(result[0].status === 'cancelled'){
            return res.status(400).json({
                message : "Order was cancelled by User"
            })
        }

        if(result[0].status === "delivered"){
            return res.status(404).json({
                message : "Order Already Delivered"
            })
        }


        db.query("UPDATE orders SET status = ? WHERE id = ? ", [status, orderId], (err) => {
            if(err) return res.status(500).json(err);
            return res.status(200).json({
                message : "Order status updated successfully"
            })
        })
    })
}


exports.getAllOrders = (req, res) => {

    const sql = `
        SELECT orders.id AS order_id,
        orders.status,
        orders.total_price,
        users.name AS user_name,
        users.email,
        products.name AS product_name,
        order_items.quantity,
        order_items.price
        FROM orders
        JOIN order_items ON order_items.order_id = orders.id
        JOIN products ON order_items.product_id = products.id
        JOIN users ON orders.user_id = users.id
        ORDER BY orders.created_at DESC
    `;


    db.query(sql , (err, orders) => {
        if(err) return res.status(500).json(err);

        if(orders.length === 0){
            return res.status(404).json({
                message : "No order exist"
            })
        }

        return res.status(200).json({
            message : "Orders fatched successfully",
            orders : orders
        })
    })
}



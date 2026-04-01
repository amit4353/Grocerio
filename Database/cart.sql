USE grocerio;

CREATE TABLE cart(
	id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
	product_id INT NOT NULL,
    quantity INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
)


SELECT * FROM cart;
SELECT * FROM users;
SELECT * FROM products;
SHOW CREATE TABLE cart;

-- ALTER TABLE cart DROP FOREIGN KEY cart_ibfk_1;
ALTER TABLE cart ADD CONSTRAINT fk_cart_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

DELETE FROM users WHERE id = 14;
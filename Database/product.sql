USE grocerio;
CREATE TABLE products(
	id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    brand VARCHAR(50) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    image TEXT NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)

INSERT INTO products (name, brand, price, image, description) VALUES

	('Fresh Apples', 'Nature Farm', 120.00, 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce', 'Fresh and juicy red apples directly from organic farms.'),
	('Bananas', 'Tropical Fresh', 60.00, 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YmFuYW5hfGVufDB8fDB8fHww', 'Naturally ripened bananas rich in potassium and energy.'),
	('Broccoli', 'Green Valley', 90.00, 'https://images.unsplash.com/photo-1614336215203-05a588f74627?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8QnJvY2NvbGl8ZW58MHx8MHx8fDA%3D', 'Healthy green broccoli packed with vitamins and fiber.'),
	('Strawberries', 'Berry Fresh', 180.00, 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6', 'Sweet and fresh strawberries perfect for desserts.'),
	('Carrots', 'Farm Fresh', 50.00, 'https://images.unsplash.com/photo-1447175008436-054170c2e979', 'Crunchy carrots full of beta-carotene and nutrients.'),
	('Tomatoes', 'Organic Basket', 70.00, 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337', 'Fresh red tomatoes ideal for salads and cooking.'),
	('Milk', 'Dairy Pure', 55.00, 'https://images.unsplash.com/photo-1563636619-e9143da7973b', 'Pure and fresh dairy milk rich in calcium.'),
	('Bread', 'Bake House', 40.00, 'https://images.unsplash.com/photo-1509440159596-0249088772ff', 'Soft and freshly baked bread perfect for breakfast.'),
	('Avocado', 'Green Harvest', 160.00, 'https://images.unsplash.com/photo-1519162808019-7de1683fa2ad', 'Creamy avocados rich in healthy fats.'),
	('Orange Juice', 'Citrus Valley', 110.00, 'https://images.unsplash.com/photo-1600271886742-f049cd451bba', 'Freshly squeezed orange juice full of vitamin C.');




SELECT * FROM products;
-- SET SQL_SAFE_UPDATES = 0;
-- DELETE FROM products;
-- delete from order_items;


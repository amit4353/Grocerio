CREATE DATABASE grocerio;
USE grocerio;

CREATE TABLE users(
	id INT AUTO_INCREMENT PRIMARY KEY,
	name VARCHAR(50) NOT NULL,
    email VARCHAR(60) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    address TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP    
);


INSERT INTO users  (name, email, password, phone_number, address) VALUES
('John Smith', 'john.smith@gmail.com', 'password123', '2025550143', '120 Maple Street, New York, NY, USA'),
('Emily Johnson', 'emily.johnson@gmail.com', 'password123', '2025550187', '45 Sunset Blvd, Los Angeles, CA, USA'),
('Michael Brown', 'michael.brown@gmail.com', 'password123', '2025550124', '78 Oak Avenue, Chicago, IL, USA'),
('Sarah Davis', 'sarah.davis@gmail.com', 'password123', '2025550176', '33 Pine Street, Houston, TX, USA'),
('David Wilson', 'david.wilson@gmail.com', 'password123', '2025550155', '890 Cedar Road, Phoenix, AZ, USA'),
('Jessica Miller', 'jessica.miller@gmail.com', 'password123', '2025550199', '67 Lakeview Drive, Philadelphia, PA, USA'),
('Daniel Moore', 'daniel.moore@gmail.com', 'password123', '2025550132', '910 Hill Street, San Antonio, TX, USA'),
('Ashley Taylor', 'ashley.taylor@gmail.com', 'password123', '2025550164', '55 River Road, San Diego, CA, USA'),
('Christopher Anderson', 'chris.anderson@gmail.com', 'password123', '2025550111', '12 Forest Lane, Dallas, TX, USA'),
('Amanda Thomas', 'amanda.thomas@gmail.com', 'password123', '2025550180', '200 Ocean Drive, Miami, FL, USA');


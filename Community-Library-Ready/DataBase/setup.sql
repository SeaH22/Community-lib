

CREATE DATABASE IF NOT EXISTS community_library;
USE community_library;


DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS books;
DROP TABLE IF EXISTS users;


CREATE TABLE books (
    book_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    author VARCHAR(100) NOT NULL,
    genre VARCHAR(80) NOT NULL,
    isbn VARCHAR(20) NOT NULL UNIQUE,
    initial_quantity INT NOT NULL,
    quantity_available INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    membership_id VARCHAR(30) NOT NULL UNIQUE,
    role ENUM('Admin', 'Member') NOT NULL DEFAULT 'Member',
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

CREATE TABLE transactions (
    transaction_id INT AUTO_INCREMENT PRIMARY KEY,
    book_id INT NOT NULL,
    user_id INT NULL,
    transaction_type ENUM('BORROW', 'RETURN', 'ADD_STOCK') NOT NULL,
    quantity INT NOT NULL,
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes VARCHAR(255),
    FOREIGN KEY (book_id) REFERENCES books(book_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL
);


INSERT INTO books (title, author, genre, isbn, initial_quantity, quantity_available) VALUES
('The Great Gatsby', 'F. Scott Fitzgerald', 'Fiction', '9780743273565', 5, 5),
('To Kill a Mockingbird', 'Harper Lee', 'Fiction', '9780061120084', 3, 3),
('1984', 'George Orwell', 'Dystopian', '9780451524935', 4, 4),
('Pride and Prejudice', 'Jane Austen', 'Romance', '9780141439518', 2, 2),
('The Hobbit', 'J.R.R. Tolkien', 'Fantasy', '9780547928227', 6, 6);

SELECT 'Database setup completed successfully!' AS message;
SELECT 'Tables created: books, users, transactions' AS info;
SELECT '5 sample books added' AS sample_data;

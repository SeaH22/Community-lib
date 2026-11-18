
const express = require('express');
const router = express.Router();
const db = require('../db');
console.log('Books route file loaded successfully!');

//  GETTING ALL BOOKS
router.get('/', (req, res) => {
    console.log('GET BOOKS ROUTE REACHED');
    const sql = 'SELECT * FROM books ORDER BY book_id DESC';
    

    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        res.json(results);
    });
});

//  ADDING A NEW BOOK
router.post('/', (req, res) => {
    const { title, author, genre, isbn, initial_quantity } = req.body;

    if (!title || !author || !genre || !isbn ||
        !Number.isInteger(initial_quantity) || initial_quantity < 0) {
        return res.status(400).json({
            message: 'Please provide valid book details and quantity.'
        });
    }

    const sql = `
        INSERT INTO books
        (title, author, genre, isbn, initial_quantity, quantity_available)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [title, author, genre, isbn, initial_quantity, initial_quantity],
        (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            res.status(201).json({
                message: 'Book added successfully!',
                book_id: result.insertId
            });
        }
    );
});

//  UPDATING A BOOK
router.put('/:id', (req, res) => {
    const { title, author, genre, isbn, initial_quantity } = req.body;
    const bookId = req.params.id;

    if (!title || !author || !genre || !isbn ||
        !Number.isInteger(initial_quantity) || initial_quantity < 0) {
        return res.status(400).json({
            message: 'Please provide valid book details and quantity.'
        });
    }

    const sql = `
        UPDATE books
        SET title = ?, author = ?, genre = ?, isbn = ?, initial_quantity = ?
        WHERE book_id = ?
    `;

    db.query(
        sql,
        [title, author, genre, isbn, initial_quantity, bookId],
        (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Book not found.' });
            }

            res.json({ message: 'Book updated successfully!' });
        }
    );
});

// DELETING A BOOK
router.delete('/:id', (req, res) => {
    const bookId = req.params.id;

    const sql = 'DELETE FROM books WHERE book_id = ?';

    db.query(sql, [bookId], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Book not found.' });
        }

        res.json({ message: 'Book deleted successfully!' });
    });
});

module.exports = router;

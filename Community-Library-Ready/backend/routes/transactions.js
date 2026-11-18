
const express = require('express');
const router = express.Router();
const db = require('../db');

// GET ALL TRANSACTIONS
router.get('/', (req, res) => {
    const sql = `
        SELECT
            transactions.transaction_id,
            transactions.book_id,
            books.title,
            transactions.user_id,
            users.name AS user_name,
            transactions.transaction_type,
            transactions.quantity,
            transactions.transaction_date,
            transactions.notes
        FROM transactions
        LEFT JOIN books ON transactions.book_id = books.book_id
        LEFT JOIN users ON transactions.user_id = users.user_id
        ORDER BY transactions.transaction_id DESC
    `;

    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        res.json(results);
    });
});

// ADD A TRANSACTION
router.post('/', (req, res) => {
    const {
        book_id,
        user_id,
        transaction_type,
        quantity,
        notes
    } = req.body;

    const allowedTypes = ['BORROW', 'RETURN', 'ADD_STOCK'];

    if (
        !Number.isInteger(Number(book_id)) ||
        Number(book_id) <= 0 ||
        !allowedTypes.includes(transaction_type) ||
        !Number.isInteger(Number(quantity)) ||
        Number(quantity) <= 0
    ) {
        return res.status(400).json({
            message: 'Please provide valid transaction details.'
        });
    }

    const bookId = Number(book_id);
    const transactionQuantity = Number(quantity);

    db.beginTransaction((err) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        const bookSql = `
            SELECT quantity_available
            FROM books
            WHERE book_id = ?
            FOR UPDATE
        `;

        db.query(bookSql, [bookId], (err, results) => {
            if (err) {
                return db.rollback(() => {
                    res.status(500).json({ error: err.message });
                });
            }

            if (results.length === 0) {
                return db.rollback(() => {
                    res.status(404).json({
                        message: 'Book not found.'
                    });
                });
            }

            const currentQuantity = results[0].quantity_available;
            let newQuantity = currentQuantity;

            if (transaction_type === 'BORROW') {
                if (currentQuantity < transactionQuantity) {
                    return db.rollback(() => {
                        res.status(400).json({
                            message: 'Not enough books available.'
                        });
                    });
                }

                newQuantity -= transactionQuantity;
            }

            if (transaction_type === 'RETURN' ||
                transaction_type === 'ADD_STOCK') {
                newQuantity += transactionQuantity;
            }

            const updateSql = `
                UPDATE books
                SET quantity_available = ?
                WHERE book_id = ?
            `;

            db.query(
                updateSql,
                [newQuantity, bookId],
                (err) => {
                    if (err) {
                        return db.rollback(() => {
                            res.status(500).json({ error: err.message });
                        });
                    }

                    const transactionSql = `
                        INSERT INTO transactions
                        (book_id, user_id, transaction_type, quantity, notes)
                        VALUES (?, ?, ?, ?, ?)
                    `;

                    db.query(
                        transactionSql,
                        [
                            bookId,
                            user_id || null,
                            transaction_type,
                            transactionQuantity,
                            notes || null
                        ],
                        (err, result) => {
                            if (err) {
                                return db.rollback(() => {
                                    res.status(500).json({
                                        error: err.message
                                    });
                                });
                            }

                            db.commit((err) => {
                                if (err) {
                                    return db.rollback(() => {
                                        res.status(500).json({
                                            error: err.message
                                        });
                                    });
                                }

                                res.status(201).json({
                                    message: 'Transaction recorded successfully!',
                                    transaction_id: result.insertId,
                                    quantity_available: newQuantity
                                });
                            });
                        }
                    );
                }
            );
        });
    });
});

module.exports = router;

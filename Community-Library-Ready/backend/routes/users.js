const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const {
    authenticateToken,
    requireAdmin
} = require('../middleware/auth');

// GET ALL USERS - ADMIN ONLY
router.get('/', authenticateToken, requireAdmin, (req, res) => {
    const sql = `
        SELECT user_id, name, membership_id, role, created_at
        FROM users
        ORDER BY user_id DESC
    `;

    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// ==========================================
// NEW ROUTE: GET MEMBER LIST FOR DROPDOWNS (ALL LOGGED IN USERS)
// ==========================================
router.get('/list', authenticateToken, (req, res) => {
    // Only select the ID and Name (no passwords or sensitive data)
    // Only fetch users whose role is 'Member'
    const sql = 'SELECT user_id, name, membership_id FROM users WHERE role = "Member"';

    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});
// ==========================================


// ADD A USER - ADMIN ONLY
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
    const { name, membership_id, role, password } = req.body;

    if (!name || !membership_id || !password ||
        !['Admin', 'Member'].includes(role)) {
        return res.status(400).json({
            message: 'Please provide valid user details.'
        });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const sql = `
            INSERT INTO users (name, membership_id, role, password)
            VALUES (?, ?, ?, ?)
        `;

        db.query(
            sql,
            [name, membership_id, role, hashedPassword],
            (err, result) => {
                if (err) {
                    return res.status(500).json({
                        error: err.message
                    });
                }

                res.status(201).json({
                    message: 'User added successfully!',
                    user_id: result.insertId
                });
            }
        );
    } catch (error) {
        res.status(500).json({
            error: 'Could not add user.'
        });
    }
});

// USER LOGIN - PUBLIC
router.post('/login', (req, res) => {
    const { membership_id, password } = req.body;

    if (!membership_id || !password) {
        return res.status(400).json({
            message: 'Membership ID and password are required.'
        });
    }

    const sql = 'SELECT * FROM users WHERE membership_id = ?';

    db.query(sql, [membership_id], async (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (results.length === 0) {
            return res.status(401).json({
                message: 'Invalid membership ID or password.'
            });
        }

        try {
            const user = results[0];

            const passwordMatches = await bcrypt.compare(
                password,
                user.password
            );

            if (!passwordMatches) {
                return res.status(401).json({
                    message: 'Invalid membership ID or password.'
                });
            }

            const token = jwt.sign(
                {
                    user_id: user.user_id,
                    membership_id: user.membership_id,
                    role: user.role
                },
                process.env.JWT_SECRET,
                { expiresIn: '2h' }
            );

            res.json({
                message: 'Login successful!',
                token,
                user: {
                    user_id: user.user_id,
                    name: user.name,
                    membership_id: user.membership_id,
                    role: user.role
                }
            });
        } catch (error) {
            res.status(500).json({
                error: 'Login failed.'
            });
        }
    });
});

// UPDATE A USER - ADMIN ONLY
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
    const { name, membership_id, role, password } = req.body;
    const userId = req.params.id;

    if (!name || !membership_id ||
        !['Admin', 'Member'].includes(role)) {
        return res.status(400).json({
            message: 'Please provide valid user details.'
        });
    }

    try {
        let sql;
        let values;

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);

            sql = `
                UPDATE users
                SET name = ?, membership_id = ?, role = ?, password = ?
                WHERE user_id = ?
            `;

            values = [
                name, membership_id, role, hashedPassword, userId
            ];
        } else {
            sql = `
                UPDATE users
                SET name = ?, membership_id = ?, role = ?
                WHERE user_id = ?
            `;

            values = [name, membership_id, role, userId];
        }

        db.query(sql, values, (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: 'User not found.'
                });
            }

            res.json({ message: 'User updated successfully!' });
        });
    } catch (error) {
        res.status(500).json({
            error: 'Could not update user.'
        });
    }
});

// DELETE A USER - ADMIN ONLY
router.delete('/:id', authenticateToken, requireAdmin, (req, res) => {
    const userId = req.params.id;

    const sql = 'DELETE FROM users WHERE user_id = ?';

    db.query(sql, [userId], (err, result) => {
        if (err) {
            return res.status(409).json({
                message: 'User could not be deleted. They may have transaction records.'
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'User not found.'
            });
        }

        res.json({ message: 'User deleted successfully!' });
    });
});

module.exports = router;
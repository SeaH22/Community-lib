(async () => {
    const bcrypt = require('bcryptjs');
    const db = require('./db');

    const hashedPassword = await bcrypt.hash('901018899',10);

    db.query(
        'INSERT INTO users (name, membership_id, role, password) VALUES (?, ?, ?, ?)',
        ['Mojakhomo', 'ADMIN001', 'Admin', hashedPassword],
        (err, result) => {
            if (err) {
                console.log('Error:', err.message);
            } else {
                console.log('Administrator created successfully!');
                console.log('Membership ID: ADMIN001');
            }
            db.end();
        }
    );
})();
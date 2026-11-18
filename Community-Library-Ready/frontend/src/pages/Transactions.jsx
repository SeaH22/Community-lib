
import { useEffect, useState } from 'react';

function Transactions() {
    const [books, setBooks] = useState([]);
    const [users, setUsers] = useState([]);
    const [transactions, setTransactions] = useState([]);

    const [formData, setFormData] = useState({
        book_id: '',
        user_id: '',
        transaction_type: 'BORROW',
        quantity: 1,
        notes: ''
    });

    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const fetchData = async () => {
        try {
            const [booksResponse, usersResponse, transactionsResponse] =
                await Promise.all([
                    fetch('http://localhost:5000/api/books', {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
}),
fetch('http://localhost:5000/api/users/list',{
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
}),
fetch('http://localhost:5000/api/transactions', {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
})
                ]);

            if (
                !booksResponse.ok ||
                !usersResponse.ok ||
                !transactionsResponse.ok
            ) {
                throw new Error('Could not load transaction information.');
            }

            const booksData = await booksResponse.json();
            const usersData = await usersResponse.json();
            const transactionsData = await transactionsResponse.json();

            setBooks(booksData);
            setUsers(usersData);
            setTransactions(transactionsData);
        } catch (err) {
            setError('Unable to load data. Check your backend server.');
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (!formData.book_id) {
            setError('Please select a book.');
            return;
        }

        if (
            formData.transaction_type === 'BORROW' &&
            !formData.user_id
        ) {
            setError('Please select the member borrowing the book.');
            return;
        }

        const quantity = Number(formData.quantity);

        if (!Number.isInteger(quantity) || quantity <= 0) {
            setError('Quantity must be a whole number greater than zero.');
            return;
        }

        try {
            const response = await fetch(
                'http://localhost:5000/api/transactions',
                {
                    method: 'POST',headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')}`
},
                    
                    body: JSON.stringify({
                        ...formData,
                        book_id: Number(formData.book_id),
                        user_id: formData.user_id
                            ? Number(formData.user_id)
                            : null,
                        quantity
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || data.error || 'Transaction failed.');
            }

            setMessage(
                `${data.message} Remaining copies: ${data.quantity_available}`
            );

            setFormData({
                book_id: '',
                user_id: '',
                transaction_type: 'BORROW',
                quantity: 1,
                notes: ''
            });

            await fetchData();
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="page-content">
            <div className="page-header">
                <div>
                    <h1>Transactions</h1>
                    <p>Manage book borrowing, returns and new stock.</p>
                </div>
            </div>

            <section className="form-section">
                <h2>Record a Transaction</h2>

                <form onSubmit={handleSubmit} className="book-form">
                    <div className="form-group">
                        <label>Select Book</label>
                        <select
                            name="book_id"
                            value={formData.book_id}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Choose a book</option>
                            {books.map(book => (
                                <option
                                    key={book.book_id}
                                    value={book.book_id}
                                >
                                    {book.title} ({book.quantity_available} available)
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Transaction Type</label>
                        <select
                            name="transaction_type"
                            value={formData.transaction_type}
                            onChange={handleChange}
                        >
                            <option value="BORROW">Borrow Book</option>
                            <option value="RETURN">Return Book</option>
                            <option value="ADD_STOCK">Add New Stock</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Member</label>
                        <select
                            name="user_id"
                            value={formData.user_id}
                            onChange={handleChange}
                        >
                            <option value="">Select a member</option>
                            {users.map(user => (
                                <option
                                    key={user.user_id}
                                    value={user.user_id}
                                >
                                    {user.name} ({user.membership_id})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Quantity</label>
                        <input
                            type="number"
                            name="quantity"
                            min="1"
                            step="1"
                            value={formData.quantity}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Notes (Optional)</label>
                        <input
                            type="text"
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            placeholder="Enter additional information"
                        />
                    </div>

                    <button type="submit" className="primary-button">
                        Record Transaction
                    </button>
                </form>

                {message && <p className="success-message">{message}</p>}
                {error && <p className="error-message">{error}</p>}
            </section>

            <section className="table-section">
                <h2>Transaction History</h2>

                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Book</th>
                                <th>Member</th>
                                <th>Transaction Type</th>
                                <th>Quantity</th>
                                <th>Date</th>
                                <th>Notes</th>
                            </tr>
                        </thead>

                        <tbody>
                            {transactions.length === 0 ? (
                                <tr>
                                    <td colSpan="6">No transactions recorded yet.</td>
                                </tr>
                            ) : (
                                transactions.map(transaction => (
                                    <tr key={transaction.transaction_id}>
                                        <td>{transaction.title}</td>
                                        <td>{transaction.user_name || 'Not specified'}</td>
                                        <td>{transaction.transaction_type}</td>
                                        <td>{transaction.quantity}</td>
                                        <td>
                                            {new Date(
                                                transaction.transaction_date
                                            ).toLocaleString()}
                                        </td>
                                        <td>{transaction.notes || '-'}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}

export default Transactions;

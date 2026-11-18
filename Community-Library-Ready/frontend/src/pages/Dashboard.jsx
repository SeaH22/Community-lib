
import { useEffect, useState } from 'react';

function Dashboard() {
    const [books, setBooks] = useState([]);
    const [users, setUsers] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                
const token = localStorage.getItem('token');

const [booksResponse, usersResponse, transactionsResponse] =
    await Promise.all([
        fetch('http://localhost:5000/api/books', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }),

        fetch('http://localhost:5000/api/users/list',{
            headers: {
                Authorization: `Bearer ${token}`
            }
        }),

        fetch('http://localhost:5000/api/transactions', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    ]);

                if (
                    !booksResponse.ok ||
                    !usersResponse.ok ||
                    !transactionsResponse.ok
                ) {
                    throw new Error('Could not load dashboard data.');
                }

                const booksData = await booksResponse.json();
                const usersData = await usersResponse.json();
                const transactionsData = await transactionsResponse.json();

                setBooks(booksData);
                setUsers(usersData);
                setTransactions(transactionsData);
            } catch (err) {
                setError('Unable to connect to the server. Please check that your backend is running.');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const totalBooks = books.reduce(
        (total, book) => total + Number(book.quantity_available),
        0
    );

    const lowStockBooks = books.filter(
        book => Number(book.quantity_available) < 2
    );

    if (loading) {
        return <div className="page-content">Loading dashboard...</div>;
    }

    if (error) {
        return <div className="page-content error-message">{error}</div>;
    }

    return (
        <div className="page-content">
            <div className="page-header">
                <div>
                    <h1>Dashboard</h1>
                    <p>Welcome to your Community Library Management System.</p>
                </div>
            </div>

            <div className="dashboard-cards">
                <div className="dashboard-card">
                    <h3>Total Books Available</h3>
                    <h2>{totalBooks}</h2>
                </div>

                <div className="dashboard-card">
                    <h3>Different Book Titles</h3>
                    <h2>{books.length}</h2>
                </div>

                <div className="dashboard-card">
                    <h3>Registered Users</h3>
                    <h2>{users.length}</h2>
                </div>

                <div className="dashboard-card">
                    <h3>Total Transactions</h3>
                    <h2>{transactions.length}</h2>
                </div>
            </div>

            <section className="dashboard-section">
                <h2>Low Stock Books</h2>

                {lowStockBooks.length === 0 ? (
                    <p>No books are currently low in stock.</p>
                ) : (
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Book Title</th>
                                    <th>Author</th>
                                    <th>Available Quantity</th>
                                </tr>
                            </thead>

                            <tbody>
                                {lowStockBooks.map(book => (
                                    <tr key={book.book_id}>
                                        <td>{book.title}</td>
                                        <td>{book.author}</td>
                                        <td>
                                            <span className="low-stock">
                                                {book.quantity_available} copies
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>

            <section className="dashboard-section">
                <h2>Recent Transactions</h2>

                {transactions.length === 0 ? (
                    <p>No transactions recorded yet.</p>
                ) : (
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Book</th>
                                    <th>User</th>
                                    <th>Type</th>
                                    <th>Quantity</th>
                                </tr>
                            </thead>

                            <tbody>
                                {transactions.slice(0, 5).map(transaction => (
                                    <tr key={transaction.transaction_id}>
                                        <td>{transaction.title}</td>
                                        <td>{transaction.user_name || 'Not specified'}</td>
                                        <td>{transaction.transaction_type}</td>
                                        <td>{transaction.quantity}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </div>
    );
}

export default Dashboard;

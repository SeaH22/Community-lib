
import { useEffect, useState } from 'react';

function BookManagement() {
    const [books, setBooks] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        genre: '',
        isbn: '',
        initial_quantity: ''
    });
    const [editingId, setEditingId] = useState(null);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const fetchBooks = async () => {
        try {
            const token = localStorage.getItem('token');

const response = await fetch('http://localhost:5000/api/books', {
    headers: {
        Authorization: `Bearer ${token}`
    }
});
            if (!response.ok) {
                throw new Error('Could not load books.');
            }

            const data = await response.json();
            setBooks(data);
            setError('');
        } catch (err) {
            setError('Unable to load books. Check that your backend is running.');
        }
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const resetForm = () => {
        setFormData({
            title: '',
            author: '',
            genre: '',
            isbn: '',
            initial_quantity: ''
        });
        setEditingId(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        const quantity = Number(formData.initial_quantity);

        if (!Number.isInteger(quantity) || quantity < 0) {
            setError('Quantity must be a whole number of zero or more.');
            return;
        }

        const bookData = {
            ...formData,
            initial_quantity: quantity
        };

        try {
            const url = editingId
                ? `http://localhost:5000/api/books/${editingId}`
                : 'http://localhost:5000/api/books';

            const response = await fetch(url, {
                method: editingId ? 'PUT' : 'POST',
                headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')}`
},
                body: JSON.stringify(bookData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || data.error || 'Could not save book.');
            }

            setMessage(data.message);
            resetForm();
            fetchBooks();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleEdit = (book) => {
        setFormData({
            title: book.title,
            author: book.author,
            genre: book.genre,
            isbn: book.isbn,
            initial_quantity: book.initial_quantity
        });

        setEditingId(book.book_id);
        setMessage('');
        setError('');
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            'Are you sure you want to delete this book?'
        );

        if (!confirmed) return;

        try {
            const response = await fetch(
                `http://localhost:5000/api/books/${id}`,
              {
    method: 'DELETE',
    headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
    }
}
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || data.error || 'Could not delete book.');
            }

            setMessage(data.message);
            setError('');
            fetchBooks();
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="page-content">
            <div className="page-header">
                <div>
                    <h1>Book Management</h1>
                    <p>Add, update and manage library books.</p>
                </div>
            </div>

            <section className="form-section">
                <h2>{editingId ? 'Update Book' : 'Add New Book'}</h2>

                <form onSubmit={handleSubmit} className="book-form">
                    <div className="form-group">
                        <label>Book Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Author</label>
                        <input
                            type="text"
                            name="author"
                            value={formData.author}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Genre</label>
                        <input
                            type="text"
                            name="genre"
                            value={formData.genre}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>ISBN</label>
                        <input
                            type="text"
                            name="isbn"
                            value={formData.isbn}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Initial Quantity</label>
                        <input
                            type="number"
                            name="initial_quantity"
                            min="0"
                            step="1"
                            value={formData.initial_quantity}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="primary-button">
                            {editingId ? 'Update Book' : 'Add Book'}
                        </button>

                        {editingId && (
                            <button
                                type="button"
                                className="secondary-button"
                                onClick={resetForm}
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>

                {message && <p className="success-message">{message}</p>}
                {error && <p className="error-message">{error}</p>}
            </section>

            <section className="table-section">
                <h2>Library Books</h2>

                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Author</th>
                                <th>Genre</th>
                                <th>ISBN</th>
                                <th>Initial Quantity</th>
                                <th>Available</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {books.length === 0 ? (
                                <tr>
                                    <td colSpan="7">No books found.</td>
                                </tr>
                            ) : (
                                books.map(book => (
                                    <tr key={book.book_id}>
                                        <td>{book.title}</td>
                                        <td>{book.author}</td>
                                        <td>{book.genre}</td>
                                        <td>{book.isbn}</td>
                                        <td>{book.initial_quantity}</td>
                                        <td>{book.quantity_available}</td>
                                        <td>
                                            <button
                                                className="edit-button"
                                                onClick={() => handleEdit(book)}
                                            >
                                                Edit
                                            </button>

                                            <button
                                                className="delete-button"
                                                onClick={() => handleDelete(book.book_id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
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

export default BookManagement;

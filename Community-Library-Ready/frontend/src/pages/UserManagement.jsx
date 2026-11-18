
import { useEffect, useState } from 'react';

function UserManagement() {
    const [users, setUsers] = useState([]);

    const [formData, setFormData] = useState({
        name: '',
        membership_id: '',
        role: 'Member',
        password: ''
    });

    const [editingId, setEditingId] = useState(null);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const fetchUsers = async () => {
        try {
           const response = await fetch('http://localhost:5000/api/users', {
    headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
    }
});

            if (!response.ok) {
                throw new Error('Could not load users.');
            }

            const data = await response.json();
            setUsers(data);
        } catch (err) {
            setError('Unable to load users. Check your backend server.');
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const resetForm = () => {
        setFormData({
            name: '',
            membership_id: '',
            role: 'Member',
            password: ''
        });

        setEditingId(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (!editingId && !formData.password) {
            setError('Please enter a password for the new user.');
            return;
        }

        try {
            const url = editingId
                ? `http://localhost:5000/api/users/${editingId}`
                : 'http://localhost:5000/api/users';

            const response = await fetch(url, {
                method: editingId ? 'PUT' : 'POST',
               headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')}`
},
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || data.error || 'Could not save user.');
            }

            setMessage(data.message);
            resetForm();
            fetchUsers();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleEdit = (user) => {
        setFormData({
            name: user.name,
            membership_id: user.membership_id,
            role: user.role,
            password: ''
        });

        setEditingId(user.user_id);
        setMessage('');
        setError('');
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            'Are you sure you want to delete this user?'
        );

        if (!confirmed) return;

        try {
            const response = await fetch(
                `http://localhost:5000/api/users/${id}`,
               {
    method: 'DELETE',
    headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
    }
}
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || data.error || 'Could not delete user.');
            }

            setMessage(data.message);
            setError('');
            fetchUsers();
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="page-content">
            <div className="page-header">
                <div>
                    <h1>User Management</h1>
                    <p>Register and manage library members and administrators.</p>
                </div>
            </div>

            <section className="form-section">
                <h2>{editingId ? 'Update User' : 'Register New User'}</h2>

                <form onSubmit={handleSubmit} className="book-form">
                    <div className="form-group">
                        <label>Full Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Membership ID</label>
                        <input
                            type="text"
                            name="membership_id"
                            value={formData.membership_id}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Role</label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                        >
                            <option value="Member">Member</option>
                            <option value="Admin">Admin</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>
                            Password {editingId ? '(Leave blank to keep current password)' : ''}
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required={!editingId}
                            minLength="6"
                            placeholder={editingId ? 'Optional new password' : 'Create a password'}
                        />
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="primary-button">
                            {editingId ? 'Update User' : 'Register User'}
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
                <h2>Registered Users</h2>

                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Membership ID</th>
                                <th>Role</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {users.length === 0 ? (
                                <tr>
                                    <td colSpan="4">No users registered yet.</td>
                                </tr>
                            ) : (
                                users.map(user => (
                                    <tr key={user.user_id}>
                                        <td>{user.name}</td>
                                        <td>{user.membership_id}</td>
                                        <td>{user.role}</td>
                                        <td>
                                            <button
                                                className="edit-button"
                                                onClick={() => handleEdit(user)}
                                            >
                                                Edit
                                            </button>

                                            <button
                                                className="delete-button"
                                                onClick={() => handleDelete(user.user_id)}
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

export default UserManagement;

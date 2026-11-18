
import { NavLink, useNavigate } from 'react-router-dom';

function Navbar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <span className="brand-icon">📖</span>
                
                <div>
                    <h2>Community Library</h2>
                    <p>Management System</p>
                </div>
            </div>

            <div className="nav-links">
                <NavLink to="/dashboard">Dashboard</NavLink>
                <NavLink to="/books">Books</NavLink>
                <NavLink to="/transactions">Transactions</NavLink>
                {JSON.parse(localStorage.getItem('user') || 'null')?.role === 'Admin' && (
    <NavLink to="/users">Users</NavLink>
)}
                <button onClick={handleLogout} className="logout-button">
                    Logout
                </button>
            </div>
        </nav>
    );
}

export default Navbar;

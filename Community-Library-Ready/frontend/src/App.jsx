
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from 'react-router-dom';

import Navbar from './components/Navbar';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import BookManagement from './pages/BookManagement';
import Transactions from './pages/Transactions';
import UserManagement from './pages/UserManagement';

import './styles/App.css';

function ProtectedRoute({ children }) {
    const token = localStorage.getItem('token');

    return token ? children : <Navigate to="/login" replace />;
}
function AdminRoute({ children }) {
    const user = JSON.parse(localStorage.getItem('user') || 'null');

    return user && user.role === 'Admin'
        ? children
        : <Navigate to="/dashboard" replace />;
}

function MainLayout({ children }) {
    return (
        <>
            <Navbar />
            {children}
        </>
    );
}

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <MainLayout>
                                <Dashboard />
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/books"
                    element={
                        <ProtectedRoute>
                            <MainLayout>
                                <BookManagement />
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/transactions"
                    element={
                        <ProtectedRoute>
                            <MainLayout>
                                <Transactions />
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />

               <Route
    path="/users"
    element={
        <ProtectedRoute>
            <AdminRoute>
                <MainLayout>
                    <UserManagement />
                </MainLayout>
            </AdminRoute>
        </ProtectedRoute>
    }
/>

                <Route path="/" element={<Navigate to="/login" replace />} />

                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;

import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ShieldAlert, Home, User, LogOut, FileText, Map } from 'lucide-react';
import NotificationsDropdown from './NotificationsDropdown';
const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="bg-white shadow-sm border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center space-x-2">
                            <ShieldAlert className="h-8 w-8 text-primary" />
                            <span className="text-xl font-bold text-gray-900">CivicConnect</span>
                        </Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        {location.pathname === '/' ? (
                            <>
                                <Link to="/login" className="text-gray-600 hover:text-primary px-3 py-2 rounded-md font-medium">Login</Link>
                                <Link to="/register" className="bg-primary text-white hover:bg-blue-700 px-4 py-2 rounded-md font-medium transition-colors">Register</Link>
                            </>
                        ) : user ? (
                            <>
                                <Link to="/feed" className="text-gray-600 hover:text-primary px-3 py-2 rounded-md font-medium"><Home className="inline w-4 h-4 mr-1"/>Feed</Link>
                                <Link to="/heatmap" className="text-gray-600 hover:text-primary px-3 py-2 rounded-md font-medium"><Map className="inline w-4 h-4 mr-1"/>Heat Map</Link>
                                <Link to="/report" className="text-gray-600 hover:text-primary px-3 py-2 rounded-md font-medium"><FileText className="inline w-4 h-4 mr-1"/>Report</Link>
                                <Link to="/profile" className="text-gray-600 hover:text-primary px-3 py-2 rounded-md font-medium"><User className="inline w-4 h-4 mr-1"/>Profile</Link>
                                <NotificationsDropdown />
                                {user.role === 'ROLE_ADMIN' && (
                                    <Link to="/admin" className="text-gray-600 hover:text-primary px-3 py-2 rounded-md font-medium">Admin</Link>
                                )}
                                <button onClick={handleLogout} className="text-gray-600 hover:text-red-600 px-3 py-2 rounded-md font-medium"><LogOut className="inline w-4 h-4 mr-1"/>Logout</button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-gray-600 hover:text-primary px-3 py-2 rounded-md font-medium">Login</Link>
                                <Link to="/register" className="bg-primary text-white hover:bg-blue-700 px-4 py-2 rounded-md font-medium transition-colors">Register</Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};
export default Navbar;

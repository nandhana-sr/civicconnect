import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ShieldAlert, Home, User, LogOut, FileText, Map, Menu, X } from 'lucide-react';
import NotificationsDropdown from './NotificationsDropdown';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
        setIsMobileMenuOpen(false);
    };

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
    const closeMobileMenu = () => setIsMobileMenuOpen(false);

    const NavLinks = ({ mobile = false }) => {
        const linkClass = mobile 
            ? "block px-3 py-4 text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50 border-b border-gray-100" 
            : "text-gray-600 hover:text-primary px-3 py-2 rounded-md font-medium whitespace-nowrap";

        if (location.pathname === '/') {
            return (
                <>
                    <Link to="/login" onClick={closeMobileMenu} className={linkClass}>Login</Link>
                    <Link to="/register" onClick={closeMobileMenu} className={mobile ? linkClass : "bg-primary text-white hover:bg-blue-700 px-4 py-2 rounded-md font-medium transition-colors whitespace-nowrap"}>Register</Link>
                </>
            );
        }

        if (user) {
            return (
                <>
                    <Link to="/feed" onClick={closeMobileMenu} className={linkClass}><Home className="inline w-4 h-4 mr-1"/>Feed</Link>
                    <Link to="/heatmap" onClick={closeMobileMenu} className={linkClass}><Map className="inline w-4 h-4 mr-1"/>Heat Map</Link>
                    <Link to="/report" onClick={closeMobileMenu} className={linkClass}><FileText className="inline w-4 h-4 mr-1"/>Report</Link>
                    <Link to="/profile" onClick={closeMobileMenu} className={linkClass}><User className="inline w-4 h-4 mr-1"/>Profile</Link>
                    {mobile ? null : <NotificationsDropdown />}
                    {user.role === 'ROLE_ADMIN' && (
                        <Link to="/admin" onClick={closeMobileMenu} className={linkClass}>Admin</Link>
                    )}
                    <button onClick={handleLogout} className={mobile ? linkClass + " text-left text-red-600" : "text-gray-600 hover:text-red-600 px-3 py-2 rounded-md font-medium whitespace-nowrap"}><LogOut className="inline w-4 h-4 mr-1"/>Logout</button>
                </>
            );
        }

        return (
            <>
                <Link to="/login" onClick={closeMobileMenu} className={linkClass}>Login</Link>
                <Link to="/register" onClick={closeMobileMenu} className={mobile ? linkClass : "bg-primary text-white hover:bg-blue-700 px-4 py-2 rounded-md font-medium transition-colors whitespace-nowrap"}>Register</Link>
            </>
        );
    };

    return (
        <nav className="bg-white shadow-sm border-b border-gray-100 relative z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center space-x-2">
                            <ShieldAlert className="h-8 w-8 text-primary" />
                            <span className="text-xl font-bold text-gray-900">CivicConnect</span>
                        </Link>
                    </div>
                    
                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-1 lg:space-x-4">
                        <NavLinks />
                    </div>

                    {/* Mobile Menu Button & Notifications (always visible) */}
                    <div className="flex items-center md:hidden space-x-2">
                        {user && <NotificationsDropdown />}
                        <button onClick={toggleMobileMenu} className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none">
                            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-16 left-0 w-full bg-white shadow-lg border-b border-gray-100 z-50">
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        <NavLinks mobile={true} />
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;

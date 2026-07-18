import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, FileText, AlertTriangle } from 'lucide-react';

const AdminLayout = () => {
    const location = useLocation();

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <div className="w-64 bg-white shadow-md flex flex-col">
                <div className="p-4 border-b">
                    <h2 className="text-xl font-bold text-gray-800">Admin Portal</h2>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    <Link to="/admin" className={`flex items-center px-4 py-2 rounded-md ${location.pathname === '/admin' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                        <LayoutDashboard className="w-5 h-5 mr-3" /> Dashboard
                    </Link>
                    <Link to="/admin/users" className={`flex items-center px-4 py-2 rounded-md ${location.pathname === '/admin/users' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                        <Users className="w-5 h-5 mr-3" /> Manage Users
                    </Link>
                    <Link to="/admin/issues" className={`flex items-center px-4 py-2 rounded-md ${location.pathname === '/admin/issues' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                        <FileText className="w-5 h-5 mr-3" /> Manage Issues
                    </Link>
                    <Link to="/admin/reports" className={`flex items-center px-4 py-2 rounded-md ${location.pathname === '/admin/reports' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                        <AlertTriangle className="w-5 h-5 mr-3" /> Reported Posts
                    </Link>
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto">
                <Outlet />
            </div>
        </div>
    );
};

export default AdminLayout;

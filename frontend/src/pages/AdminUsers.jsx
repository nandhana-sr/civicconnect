import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Shield, AlertCircle, Ban, CheckCircle } from 'lucide-react';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        try {
            const response = await api.get('/admin/users');
            setUsers(response.data);
        } catch (error) {
            console.error("Failed to fetch users", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const toggleStatus = async (userId, currentStatus) => {
        const newStatus = currentStatus === 'SUSPENDED' ? 'ACTIVE' : 'SUSPENDED';
        try {
            await api.put(`/admin/users/${userId}/status`, { status: newStatus });
            fetchUsers();
        } catch (error) {
            console.error("Failed to update user status", error);
        }
    };

    const warnUser = async (userId) => {
        const message = prompt("Enter warning message:");
        if (message) {
            try {
                await api.post(`/admin/users/${userId}/warn`, { message });
                alert("Warning successfully sent to the user's notification box!");
            } catch (error) {
                console.error("Failed to send warning", error);
                alert("Failed to send warning.");
            }
        }
    }

    if (loading) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Manage Users</h1>
            
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                    {users.map((user) => (
                        <li key={user.id} className="p-4 sm:px-6 flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                            <div className="flex items-center">
                                {user.profilePictureUrl ? (
                                    <img className="h-12 w-12 rounded-full mr-4 object-cover" src={user.profilePictureUrl} alt="" />
                                ) : (
                                    <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                                        <span className="text-gray-500 font-bold">{user.fullName?.[0]}</span>
                                    </div>
                                )}
                                <div>
                                    <p className="text-sm font-medium text-indigo-600 truncate">{user.fullName} {user.role === 'ROLE_ADMIN' && <Shield className="inline w-4 h-4 ml-1 text-primary"/>}</p>
                                    <p className="mt-1 flex items-center text-sm text-gray-500">
                                        {user.email}
                                    </p>
                                    <p className="mt-1 flex items-center text-xs text-gray-400">
                                        Joined: {new Date(user.createdAt).toLocaleDateString()} | Status: 
                                        <span className={`ml-1 font-semibold ${user.status === 'SUSPENDED' ? 'text-red-600' : 'text-green-600'}`}>
                                            {user.status || 'ACTIVE'}
                                        </span>
                                    </p>
                                </div>
                            </div>
                            <div className="flex space-x-2">
                                <button onClick={() => warnUser(user.id)} className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-md text-sm font-medium hover:bg-yellow-200 flex items-center">
                                    <AlertCircle className="w-4 h-4 mr-1"/> Warn
                                </button>
                                {user.status === 'SUSPENDED' ? (
                                    <button onClick={() => toggleStatus(user.id, user.status)} className="px-3 py-1 bg-green-100 text-green-700 rounded-md text-sm font-medium hover:bg-green-200 flex items-center">
                                        <CheckCircle className="w-4 h-4 mr-1"/> Reactivate
                                    </button>
                                ) : (
                                    <button onClick={() => toggleStatus(user.id, user.status)} className="px-3 py-1 bg-red-100 text-red-700 rounded-md text-sm font-medium hover:bg-red-200 flex items-center">
                                        <Ban className="w-4 h-4 mr-1"/> Suspend
                                    </button>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default AdminUsers;

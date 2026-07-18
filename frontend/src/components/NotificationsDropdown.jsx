import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { Bell, Check } from 'lucide-react';

const NotificationsDropdown = () => {
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const fetchNotifs = async () => {
            try {
                const res = await api.get('/notifications');
                setNotifications(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchNotifs();
        // Poll every 10 seconds for demo purposes
        const interval = setInterval(fetchNotifs, 10000);
        return () => clearInterval(interval);
    }, []);

    const markAsRead = async (id) => {
        try {
            await api.put(`/notifications/${id}/read`);
            setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
        } catch (err) {
            console.error(err);
        }
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div className="relative">
            <button onClick={() => setIsOpen(!isOpen)} className="relative p-2 text-gray-600 hover:text-primary transition-colors">
                <Bell className="w-6 h-6" />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                        {unreadCount}
                    </span>
                )}
            </button>
            
            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50">
                    <div className="p-4 bg-gray-50 border-b border-gray-100 font-bold text-gray-700">Notifications</div>
                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-4 text-center text-gray-500">No notifications</div>
                        ) : (
                            notifications.map(notif => (
                                <div key={notif.id} className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors ${!notif.read ? 'bg-blue-50/30' : ''}`}>
                                    <p className="text-sm text-gray-800">{notif.message}</p>
                                    <div className="mt-2 flex justify-between items-center">
                                        <span className="text-xs text-gray-400">{new Date(notif.createdAt).toLocaleDateString()}</span>
                                        {!notif.read && (
                                            <button onClick={() => markAsRead(notif.id)} className="text-xs text-primary hover:text-blue-700 flex items-center">
                                                <Check className="w-3 h-3 mr-1"/> Mark read
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationsDropdown;

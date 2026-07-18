import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../utils/api';
export const AuthContext = createContext(null);
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                // Also get user details from localStorage
                const id = localStorage.getItem('userId');
                const role = localStorage.getItem('role');
                const email = localStorage.getItem('email');
                setUser({ token, id, email, role, ...decoded });
            } catch(e) {
                localStorage.clear();
            }
        }
        setLoading(false);
    }, []);
    const login = async (email, password) => {
        const res = await api.post('/auth/login', { email, password });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('userId', res.data.id);
        localStorage.setItem('role', res.data.role);
        localStorage.setItem('email', res.data.email);
        setUser(res.data);
        return res.data;
    };
    const logout = () => {
        localStorage.clear();
        setUser(null);
    };
    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
const Login = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userData = await login(email, password);
            if (userData && userData.role === 'ROLE_ADMIN') {
                navigate('/admin');
            } else {
                navigate('/feed');
            }
        } catch (err) {
            setError('Invalid credentials');
        }
    };
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">Sign in to CivicConnect</h2>
                {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 border" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 border" />
                    </div>
                    <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-blue-700 focus:outline-none">Sign In</button>
                </form>
                <div className="mt-4 text-center text-sm text-gray-600">
                    Don't have an account? <Link to="/register" className="text-primary hover:underline">Register</Link>
                </div>
            </div>
        </div>
    );
};
export default Login;

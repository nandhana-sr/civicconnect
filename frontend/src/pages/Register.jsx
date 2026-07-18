import React, { useState } from 'react';
import api from '../utils/api';
import { useNavigate, Link } from 'react-router-dom';
const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ fullName: '', email: '', mobileNumber: '', password: '', district: '', city: '', locality: '' });
    const [error, setError] = useState('');
    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/auth/register', formData);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4 py-12">
            <div className="max-w-xl w-full bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">Create your account</h2>
                {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="col-span-2 md:col-span-1">
                        <label className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input name="fullName" onChange={handleChange} required className="mt-1 w-full rounded-md border-gray-300 p-2 border" />
                    </div>
                    <div className="col-span-2 md:col-span-1">
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input name="email" type="email" onChange={handleChange} required className="mt-1 w-full rounded-md border-gray-300 p-2 border" />
                    </div>
                    <div className="col-span-2 md:col-span-1">
                        <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
                        <input name="mobileNumber" onChange={handleChange} required className="mt-1 w-full rounded-md border-gray-300 p-2 border" />
                    </div>
                    <div className="col-span-2 md:col-span-1">
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input name="password" type="password" onChange={handleChange} required className="mt-1 w-full rounded-md border-gray-300 p-2 border" />
                    </div>
                    <div className="col-span-2 md:col-span-1">
                        <label className="block text-sm font-medium text-gray-700">District (Tamil Nadu)</label>
                        <input name="district" onChange={handleChange} required className="mt-1 w-full rounded-md border-gray-300 p-2 border" />
                    </div>
                    <div className="col-span-2 md:col-span-1">
                        <label className="block text-sm font-medium text-gray-700">City</label>
                        <input name="city" onChange={handleChange} required className="mt-1 w-full rounded-md border-gray-300 p-2 border" />
                    </div>
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Locality</label>
                        <input name="locality" onChange={handleChange} required className="mt-1 w-full rounded-md border-gray-300 p-2 border" />
                    </div>
                    <div className="col-span-2">
                        <button type="submit" className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-blue-700">Register</button>
                    </div>
                </form>
                <div className="mt-4 text-center text-sm text-gray-600">
                    Already have an account? <Link to="/login" className="text-primary hover:underline">Login</Link>
                </div>
            </div>
        </div>
    );
};
export default Register;

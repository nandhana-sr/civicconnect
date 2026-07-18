import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Users, FileText, CheckCircle, XCircle, AlertTriangle, Activity } from 'lucide-react';
import { PieChart, Pie, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/admin/stats');
                setStats(response.data);
            } catch (error) {
                console.error("Failed to fetch admin stats", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
    }

    if (!stats) return <div className="text-center mt-10">Error loading statistics.</div>;

    // Data for charts
    const categoryData = stats.categoryData || [];
    const statusData = stats.statusData || [];

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    return (
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
            
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow p-6 flex items-center">
                    <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4"><Users className="w-8 h-8"/></div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Total Users</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow p-6 flex items-center">
                    <div className="p-3 rounded-full bg-indigo-100 text-indigo-600 mr-4"><FileText className="w-8 h-8"/></div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Total Issues</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.totalIssues}</p>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow p-6 flex items-center">
                    <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4"><Activity className="w-8 h-8"/></div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Reported Issues</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.reportedIssues}</p>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow p-6 flex items-center">
                    <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4"><CheckCircle className="w-8 h-8"/></div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Resolved Issues</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.resolvedIssues}</p>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow p-6 flex items-center">
                    <div className="p-3 rounded-full bg-red-100 text-red-600 mr-4"><XCircle className="w-8 h-8"/></div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Rejected Issues</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.rejectedIssues}</p>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow p-6 flex items-center">
                    <div className="p-3 rounded-full bg-orange-100 text-orange-600 mr-4"><AlertTriangle className="w-8 h-8"/></div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Total Reports</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.totalReports}</p>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow p-6 flex items-center md:col-span-2">
                    <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4"><Activity className="w-8 h-8"/></div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Most Reported Category</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.mostReportedCategory || 'N/A'}</p>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Bar Chart for Status */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Issues by Status</h2>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={statusData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="count" fill="#3b82f6" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Pie Chart for Categories */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Issues by Category</h2>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={categoryData} cx="50%" cy="50%" labelLine={false} label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`} outerRadius={100} fill="#8884d8" dataKey="value">
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;

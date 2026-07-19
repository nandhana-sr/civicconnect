import React, { useState, useEffect } from 'react';
import api, { API_BASE_URL } from '../utils/api';
import { Eye, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';

const AdminIssues = () => {
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchIssues = async () => {
        try {
            const response = await api.get('/issues');
            setIssues(response.data);
        } catch (error) {
            console.error("Failed to fetch issues", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchIssues();
    }, []);

    const updateStatus = async (issueId, newStatus) => {
        try {
            await api.put(`/admin/issues/${issueId}/status`, { status: newStatus });
            fetchIssues();
        } catch (error) {
            console.error("Failed to update status", error);
        }
    };

    const deleteIssue = async (issueId) => {
        if (!window.confirm("Are you sure you want to completely delete this issue and all its comments?")) return;
        try {
            await api.delete(`/admin/issues/${issueId}`);
            fetchIssues();
        } catch (error) {
            console.error("Failed to delete issue", error);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'REPORTED': return 'bg-yellow-100 text-yellow-800';
            case 'UNDER_REVIEW': return 'bg-blue-100 text-blue-800';
            case 'ASSIGNED': return 'bg-purple-100 text-purple-800';
            case 'RESOLVED': return 'bg-green-100 text-green-800';
            case 'REJECTED': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Manage Issues</h1>
            
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                    {issues.map((issue) => (
                        <li key={issue.id} className="p-4 sm:px-6 hover:bg-gray-50">
                            <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                                <div className="flex flex-1">
                                    {issue.images && issue.images.length > 0 ? (
                                        <img src={`${API_BASE_URL}${issue.images[0]}`} alt="" className="h-16 w-24 object-cover rounded mr-4" />
                                    ) : (
                                        <div className="h-16 w-24 bg-gray-200 rounded flex items-center justify-center mr-4 text-gray-400">No Image</div>
                                    )}
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-indigo-600 truncate">{issue.title}</p>
                                        <p className="mt-1 flex items-center text-sm text-gray-500">
                                            {issue.category} • {issue.city}, {issue.locality}
                                        </p>
                                        <p className="mt-1 text-xs text-gray-400">
                                            Reporter: {issue.reporter?.fullName} | Date: {new Date(issue.createdAt).toLocaleDateString()} | Upvotes: {issue.supportsCount || 0}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(issue.status)}`}>
                                        {issue.status}
                                    </span>
                                    <div className="flex flex-col space-y-2">
                                        <select 
                                            value={issue.status}
                                            onChange={(e) => updateStatus(issue.id, e.target.value)}
                                            className="block w-full pl-3 pr-10 py-1 text-xs border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-xs rounded-md"
                                        >
                                            <option value="REPORTED">Reported</option>
                                            <option value="UNDER_REVIEW">Under Review</option>
                                            <option value="ASSIGNED">Assigned</option>
                                            <option value="RESOLVED">Resolved</option>
                                            <option value="REJECTED">Rejected</option>
                                        </select>
                                    </div>
                                    <button 
                                        onClick={() => deleteIssue(issue.id)}
                                        className="text-red-500 hover:text-red-700 transition-colors p-2 rounded-full hover:bg-red-50"
                                        title="Delete Issue"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default AdminIssues;

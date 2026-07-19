import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Trash2, AlertTriangle } from 'lucide-react';

const AdminReports = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchReports = async () => {
        try {
            const response = await api.get('/admin/reports');
            setReports(response.data);
        } catch (error) {
            console.error("Failed to fetch reports", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    const ignoreReport = async (reportId) => {
        try {
            await api.delete(`/admin/reports/${reportId}`);
            fetchReports();
        } catch (error) {
            console.error("Failed to ignore report", error);
        }
    };

    const removePost = async (issueId, reportId) => {
        // Normally this would call an endpoint to delete the issue, then the report.
        alert(`Issue ${issueId} deletion logic to be connected. (Removing from feed)`);
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Reported Posts</h1>
            
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                    {reports.length === 0 ? (
                        <li className="p-4 text-center text-gray-500">No reported posts.</li>
                    ) : reports.map((report) => (
                        <li key={report.id} className="p-4 sm:px-6 hover:bg-gray-50 flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                            <div className="flex-1">
                                <p className="text-sm font-medium text-red-600 flex items-center">
                                    <AlertTriangle className="w-4 h-4 mr-1"/> Reason: {report.reason}
                                </p>
                                <p className="mt-1 text-sm text-gray-900 font-semibold">
                                    Issue: {report.issue?.title}
                                </p>
                                <p className="mt-1 text-xs text-gray-500">
                                    Reported By: {report.reportedBy?.fullName} | Date: {new Date(report.reportTime).toLocaleString()}
                                </p>
                            </div>
                            <div className="flex space-x-2">
                                <button onClick={() => ignoreReport(report.id)} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-200">
                                    Ignore
                                </button>
                                <button onClick={() => removePost(report.issue?.id, report.id)} className="px-3 py-1 bg-red-100 text-red-700 rounded-md text-sm font-medium hover:bg-red-200 flex items-center">
                                    <Trash2 className="w-4 h-4 mr-1"/> Remove Post
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default AdminReports;

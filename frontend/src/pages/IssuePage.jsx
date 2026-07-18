import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import IssueCard from '../components/IssueCard';
import { ArrowLeft } from 'lucide-react';

const IssuePage = () => {
    const { id } = useParams();
    const [issue, setIssue] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchIssue = async () => {
            try {
                const response = await api.get(`/issues/${id}`);
                setIssue(response.data);
            } catch (err) {
                console.error("Failed to fetch issue", err);
                setError("Issue not found or an error occurred.");
            } finally {
                setLoading(false);
            }
        };
        fetchIssue();
    }, [id]);

    if (loading) {
        return <div className="max-w-3xl mx-auto py-12 px-4 text-center">Loading issue details...</div>;
    }

    if (error || !issue) {
        return (
            <div className="max-w-3xl mx-auto py-12 px-4 text-center">
                <p className="text-red-500 mb-4">{error || 'Issue not found.'}</p>
                <Link to="/heatmap" className="text-primary hover:underline">Return to Heat Map</Link>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto py-8 px-4">
            <div className="mb-6">
                <Link to="/heatmap" className="inline-flex items-center text-gray-600 hover:text-primary transition-colors font-medium">
                    <ArrowLeft className="w-4 h-4 mr-1"/> Back to Heat Map
                </Link>
            </div>
            <IssueCard issue={issue} />
        </div>
    );
};

export default IssuePage;

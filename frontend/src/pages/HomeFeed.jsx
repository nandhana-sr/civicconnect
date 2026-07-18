import React, { useEffect, useState, useContext } from 'react';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { MapPin, MessageSquare, Heart, AlertTriangle, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import IssueCard from '../components/IssueCard';

const HomeFeed = () => {
    const [issues, setIssues] = useState([]);
    const [sortBy, setSortBy] = useState('NEWEST');

    useEffect(() => {
        const fetchIssues = async () => {
            try {
                const res = await api.get('/issues');
                setIssues(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchIssues();
    }, []);

    const sortedIssues = [...issues].sort((a, b) => {
        if (sortBy === 'NEWEST') return new Date(b.createdAt) - new Date(a.createdAt);
        if (sortBy === 'OLDEST') return new Date(a.createdAt) - new Date(b.createdAt);
        if (sortBy === 'MOST_UPVOTED') return b.supportsCount - a.supportsCount;
        return 0;
    });

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Recent Civic Issues</h2>
                <select 
                    value={sortBy} 
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm py-2 px-3"
                >
                    <option value="NEWEST">Newest First</option>
                    <option value="OLDEST">Oldest First</option>
                    <option value="MOST_UPVOTED">Most Upvoted</option>
                </select>
            </div>
            <div className="space-y-6">
                {sortedIssues.map(issue => (
                    <IssueCard key={issue.id} issue={issue} />
                ))}
                {sortedIssues.length === 0 && <p className="text-gray-500 text-center py-10 bg-white rounded-xl shadow-sm border border-gray-100">No issues reported yet.</p>}
            </div>
        </div>
    );
};

export default HomeFeed;

import React, { useState, useContext } from 'react';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { MapPin, MessageSquare, Heart, AlertTriangle, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const IssueCard = ({ issue: initialIssue }) => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [issue, setIssue] = useState(initialIssue);
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');

    const toggleSupport = async () => {
        if (!user) {
            navigate('/login');
            return;
        }
        try {
            const res = await api.post(`/support/issue/${issue.id}`);
            // Optimistic update
            const delta = res.data === "Support added" ? 1 : -1;
            setIssue({ ...issue, supportsCount: issue.supportsCount + delta });
        } catch (err) {
            console.error(err);
        }
    };

    const loadComments = async () => {
        try {
            const res = await api.get(`/comments/issue/${issue.id}`);
            setComments(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleToggleComments = () => {
        if (!showComments) {
            loadComments();
        }
        setShowComments(!showComments);
    };

    const submitComment = async (e) => {
        e.preventDefault();
        if (!user) {
            navigate('/login');
            return;
        }
        if (!newComment.trim()) return;
        try {
            const res = await api.post(`/comments/issue/${issue.id}`, newComment, {
                headers: { 'Content-Type': 'text/plain' }
            });
            setComments([...comments, res.data]);
            setIssue({ ...issue, commentsCount: issue.commentsCount + 1 });
            setNewComment('');
        } catch (err) {
            console.error(err);
        }
    };

    const reportIssue = async () => {
        if (!user) {
            navigate('/login');
            return;
        }
        const reason = prompt("Why are you reporting this issue?");
        if (reason) {
            try {
                await api.post(`/issues/${issue.id}/report`, { reason });
                alert("Issue reported successfully.");
            } catch (err) {
                console.error(err);
                alert("Failed to report issue.");
            }
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-xl font-bold text-gray-900">{issue.title}</h3>
                    <div className="text-sm text-gray-500 flex items-center mt-1">
                        <MapPin className="w-4 h-4 mr-1"/> {issue.locality}, {issue.city}
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        issue.status === 'RESOLVED' ? 'bg-green-100 text-green-800' :
                        issue.status === 'UNDER_REVIEW' ? 'bg-blue-100 text-blue-800' :
                        issue.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                        issue.status === 'ASSIGNED' ? 'bg-purple-100 text-purple-800' :
                        'bg-yellow-100 text-yellow-800'
                    }`}>
                        {issue.status}
                    </span>
                </div>
            </div>
            
            <p className="text-gray-700 mb-4">{issue.detailedDescription || issue.shortDescription}</p>
            {issue.images && issue.images.length > 0 && (
                <img src={`http://localhost:8080${issue.images[0]}`} alt="Issue" className="w-full h-64 object-cover rounded-lg mb-4"/>
            )}
            
            <div className="flex items-center space-x-6 text-gray-500 border-t pt-4 mt-4">
                <button onClick={toggleSupport} className="flex items-center hover:text-red-500 transition-colors font-medium">
                    <Heart className="w-5 h-5 mr-1"/> {issue.supportsCount} Upvotes
                </button>
                <button onClick={handleToggleComments} className="flex items-center hover:text-primary transition-colors font-medium">
                    <MessageSquare className="w-5 h-5 mr-1"/> {issue.commentsCount} Comments
                </button>
                <button onClick={reportIssue} className="flex items-center hover:text-red-600 transition-colors font-medium ml-auto">
                    <AlertTriangle className="w-5 h-5 mr-1"/> Report
                </button>
            </div>

            {showComments && (
                <div className="mt-4 border-t pt-4">
                    <h4 className="font-semibold text-gray-800 mb-4">Comments</h4>
                    <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
                        {comments.length === 0 ? (
                            <p className="text-gray-500 text-sm">No comments yet. Be the first!</p>
                        ) : (
                            comments.map(comment => (
                                <div key={comment.id} className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <span className="font-semibold text-sm text-gray-900">{comment.user.fullName}</span>
                                        <span className="text-xs text-gray-400">{new Date(comment.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-gray-700 text-sm">{comment.content}</p>
                                </div>
                            ))
                        )}
                    </div>
                    <form onSubmit={submitComment} className="mt-4 relative">
                        <input 
                            type="text" 
                            value={newComment} 
                            onChange={(e) => setNewComment(e.target.value)} 
                            placeholder={user ? "Write a comment..." : "Login to comment..."}
                            disabled={!user}
                            className="w-full border border-gray-300 rounded-full py-2 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                        <button type="submit" disabled={!user || !newComment.trim()} className="absolute right-2 top-1/2 -translate-y-1/2 text-primary hover:text-blue-700 disabled:text-gray-400">
                            <Send className="w-5 h-5"/>
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default IssueCard;

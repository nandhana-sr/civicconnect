import React, { useEffect, useState, useContext } from 'react';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { User, Shield, Star, Award } from 'lucide-react';

const Profile = () => {
    const { user } = useContext(AuthContext);
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get('/users/profile');
                setProfile(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchProfile();
    }, []);

    if (!profile) return <div className="text-center p-8">Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto py-12 px-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-primary h-32"></div>
                <div className="px-8 pb-8">
                    <div className="relative flex justify-between items-end -mt-12 mb-6">
                        <div className="bg-white p-2 rounded-full shadow-md">
                            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-4xl text-gray-500">
                                {profile.fullName.charAt(0)}
                            </div>
                        </div>
                        <span className="px-4 py-2 bg-blue-50 text-blue-700 font-bold rounded-full">
                            {profile.role.replace('ROLE_', '')}
                        </span>
                    </div>
                    
                    <h2 className="text-3xl font-extrabold text-gray-900">{profile.fullName}</h2>
                    <p className="text-gray-500 mt-1">{profile.locality}, {profile.city}</p>

                    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 flex items-center">
                            <Award className="w-10 h-10 text-blue-600 mr-4"/>
                            <div>
                                <p className="text-sm text-blue-800 font-semibold">Total Credits</p>
                                <p className="text-2xl font-bold text-blue-900">{profile.totalCredits || 0}</p>
                            </div>
                        </div>
                        <div className="bg-green-50 p-6 rounded-xl border border-green-100 flex items-center">
                            <Shield className="w-10 h-10 text-green-600 mr-4"/>
                            <div>
                                <p className="text-sm text-green-800 font-semibold">Trust Score</p>
                                <p className="text-2xl font-bold text-green-900">{profile.trustScore || 0}</p>
                            </div>
                        </div>
                        <div className="bg-purple-50 p-6 rounded-xl border border-purple-100 flex items-center">
                            <Star className="w-10 h-10 text-purple-600 mr-4"/>
                            <div>
                                <p className="text-sm text-purple-800 font-semibold">Impact Score</p>
                                <p className="text-2xl font-bold text-purple-900">{profile.impactScore || 0}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;

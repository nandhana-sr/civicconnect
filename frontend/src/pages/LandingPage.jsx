import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Users, Activity } from 'lucide-react';
const LandingPage = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center">
            <div className="w-full bg-primary text-white py-20 px-4 text-center">
                <h1 className="text-5xl font-extrabold mb-6">Empowering Citizens of Tamil Nadu</h1>
                <p className="text-xl mb-10 max-w-2xl mx-auto">Report civic issues, engage with your community, and help improve public infrastructure with CivicConnect.</p>
                <Link to="/register" className="bg-white text-primary font-bold py-3 px-8 rounded-full shadow-lg hover:bg-gray-100 transition-colors">Join the Community</Link>
            </div>
            <div className="max-w-7xl mx-auto py-16 px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white p-6 rounded-xl shadow-sm text-center">
                    <MapPin className="w-12 h-12 text-secondary mx-auto mb-4"/>
                    <h3 className="text-xl font-bold mb-2">Report Issues</h3>
                    <p className="text-gray-600">Easily report road damage, garbage, and more with exact location mapping.</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm text-center">
                    <Users className="w-12 h-12 text-secondary mx-auto mb-4"/>
                    <h3 className="text-xl font-bold mb-2">Community Driven</h3>
                    <p className="text-gray-600">Support and comment on issues raised by others in your locality.</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm text-center">
                    <Activity className="w-12 h-12 text-secondary mx-auto mb-4"/>
                    <h3 className="text-xl font-bold mb-2">Track Progress</h3>
                    <p className="text-gray-600">Get updates as authorities verify and resolve the reported issues.</p>
                </div>
            </div>
        </div>
    );
};
export default LandingPage;

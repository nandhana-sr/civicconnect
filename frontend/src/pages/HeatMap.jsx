import React, { useState, useEffect, useRef } from 'react';
import api from '../utils/api';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet.heat';

// Fix for default marker icons in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const HeatLayer = ({ points }) => {
    const map = useMap();
    useEffect(() => {
        if (!map) return;
        const heatLayer = L.heatLayer(points, {
            radius: 25,
            blur: 15,
            maxZoom: 17,
        }).addTo(map);

        return () => {
            map.removeLayer(heatLayer);
        };
    }, [map, points]);
    return null;
};

const HeatMap = () => {
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterCategory, setFilterCategory] = useState('ALL');
    const [filterStatus, setFilterStatus] = useState('ALL');

    useEffect(() => {
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
        fetchIssues();
        
        // Auto refresh every 30 seconds
        const interval = setInterval(fetchIssues, 30000);
        return () => clearInterval(interval);
    }, []);

    const filteredIssues = issues.filter(issue => {
        if (filterCategory !== 'ALL' && issue.category !== filterCategory) return false;
        if (filterStatus !== 'ALL' && issue.status !== filterStatus) return false;
        return issue.latitude && issue.longitude; // Must have coordinates
    });

    const heatPoints = filteredIssues.map(issue => [issue.latitude, issue.longitude, 1]); // 1 is intensity

    if (loading) return <div className="p-8 text-center">Loading Map...</div>;

    return (
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Civic Issues Heat Map</h1>
            
            <div className="bg-white p-4 rounded-lg shadow mb-6 flex space-x-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Category</label>
                    <select 
                        value={filterCategory} 
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                    >
                        <option value="ALL">All Categories</option>
                        <option value="Road Damage">Road Damage</option>
                        <option value="Garbage">Garbage</option>
                        <option value="Water Leakage">Water Leakage</option>
                        <option value="Electricity">Electricity</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <select 
                        value={filterStatus} 
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                    >
                        <option value="ALL">All Statuses</option>
                        <option value="REPORTED">Reported</option>
                        <option value="UNDER_REVIEW">Under Review</option>
                        <option value="ASSIGNED">Assigned</option>
                        <option value="RESOLVED">Resolved</option>
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden" style={{ height: '600px' }}>
                <MapContainer center={[11.0168, 76.9558]} zoom={12} style={{ height: '100%', width: '100%' }}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <HeatLayer points={heatPoints} />
                    
                    {filteredIssues.map((issue) => (
                        <Marker key={issue.id} position={[issue.latitude, issue.longitude]}>
                            <Popup>
                                <div className="p-2">
                                    <h3 className="font-bold text-lg">{issue.title}</h3>
                                    <p className="text-sm text-gray-600 mb-2">{issue.shortDescription}</p>
                                    <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full mb-2">
                                        {issue.status}
                                    </span>
                                    <br/>
                                    <a href={`/issue/${issue.id}`} className="text-primary hover:underline text-sm font-medium">View Details</a>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>
        </div>
    );
};

export default HeatMap;

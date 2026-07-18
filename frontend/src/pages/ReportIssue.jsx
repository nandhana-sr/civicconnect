import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

const MapUpdater = ({ position }) => {
    const map = useMap();
    useEffect(() => {
        if (position) {
            map.flyTo([position.lat, position.lng], map.getZoom());
        }
    }, [position, map]);
    return null;
};

const LocationMarker = ({ position, setPosition, setFormData, formData }) => {
    useMapEvents({
        async click(e) {
            const { lat, lng } = e.latlng;
            setPosition({ lat, lng });
            try {
                // Reverse geocoding
                const res = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
                const address = res.data.address;
                if (address) {
                    setFormData({
                        ...formData,
                        district: address.state_district || address.county || address.district || formData.district,
                        city: address.city || address.town || address.village || formData.city,
                        locality: address.suburb || address.neighbourhood || address.road || formData.locality
                    });
                }
            } catch (err) {
                console.error("Reverse geocoding failed", err);
            }
        }
    });
    return position === null ? null : <Marker position={position}></Marker>;
};

const ReportIssue = () => {
    const navigate = useNavigate();
    const [position, setPosition] = useState({ lat: 11.0168, lng: 76.9558 }); // Coimbatore default
    const [formData, setFormData] = useState({
        title: '', category: 'Road Damage', shortDescription: '', detailedDescription: '',
        district: '', city: '', locality: '', severity: 'LOW'
    });
    const [image, setImage] = useState(null);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleFile = (e) => setImage(e.target.files[0]);

    // Forward Geocoding when inputs change (debounced)
    useEffect(() => {
        const timeoutId = setTimeout(async () => {
            const { district, city, locality } = formData;
            if (district || city || locality) {
                const query = `${locality ? locality + ',' : ''} ${city ? city + ',' : ''} ${district ? district : ''}`;
                try {
                    const res = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
                    if (res.data && res.data.length > 0) {
                        setPosition({
                            lat: parseFloat(res.data[0].lat),
                            lng: parseFloat(res.data[0].lon)
                        });
                    }
                } catch (err) {
                    console.error("Forward geocoding failed", err);
                }
            }
        }, 1500); // 1.5s debounce to respect Nominatim limits

        return () => clearTimeout(timeoutId);
    }, [formData.district, formData.city, formData.locality]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        data.append('latitude', position.lat);
        data.append('longitude', position.lng);
        if (image) data.append('images', image);
        try {
            await api.post('/issues', data, { headers: { 'Content-Type': 'multipart/form-data' } });
            navigate('/feed');
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="max-w-3xl mx-auto py-8 px-4">
            <h2 className="text-2xl font-bold mb-6">Report a Civic Issue</h2>
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <input name="title" onChange={handleChange} required className="mt-1 w-full rounded-md border-gray-300 p-2 border" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Category</label>
                        <select name="category" onChange={handleChange} className="mt-1 w-full rounded-md border-gray-300 p-2 border">
                            <option>Road Damage</option>
                            <option>Garbage</option>
                            <option>Water Leakage</option>
                            <option>Electricity</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Severity</label>
                        <select name="severity" onChange={handleChange} className="mt-1 w-full rounded-md border-gray-300 p-2 border">
                            <option value="LOW">Low</option>
                            <option value="MEDIUM">Medium</option>
                            <option value="HIGH">High</option>
                            <option value="CRITICAL">Critical</option>
                        </select>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Short Description</label>
                    <input name="shortDescription" onChange={handleChange} required className="mt-1 w-full rounded-md border-gray-300 p-2 border" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Detailed Description</label>
                    <textarea name="detailedDescription" onChange={handleChange} rows="4" className="mt-1 w-full rounded-md border-gray-300 p-2 border"></textarea>
                </div>
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">District</label>
                        <input name="district" value={formData.district} onChange={handleChange} required className="mt-1 w-full border p-2 rounded" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">City</label>
                        <input name="city" value={formData.city} onChange={handleChange} required className="mt-1 w-full border p-2 rounded" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Locality</label>
                        <input name="locality" value={formData.locality} onChange={handleChange} required className="mt-1 w-full border p-2 rounded" />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pin Location on Map</label>
                    <p className="text-xs text-gray-500 mb-2">Clicking the map auto-fills your address, and typing your address moves the map!</p>
                    <div className="h-64 rounded-xl overflow-hidden border relative z-0">
                        <MapContainer center={[position.lat, position.lng]} zoom={13} style={{ height: "100%", width: "100%" }}>
                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                            <MapUpdater position={position} />
                            <LocationMarker position={position} setPosition={setPosition} setFormData={setFormData} formData={formData} />
                        </MapContainer>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Upload Image</label>
                    <input type="file" onChange={handleFile} accept="image/*" className="mt-1 block w-full" />
                </div>
                <button type="submit" className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors">Submit Report</button>
            </form>
        </div>
    );
};

export default ReportIssue;

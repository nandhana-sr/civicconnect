import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import HomeFeed from './pages/HomeFeed';
import ReportIssue from './pages/ReportIssue';
import Profile from './pages/Profile';
import AdminRoute from './components/AdminRoute';
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminIssues from './pages/AdminIssues';
import AdminReports from './pages/AdminReports';
import HeatMap from './pages/HeatMap';
import IssuePage from './pages/IssuePage';
import { AuthProvider } from './context/AuthContext';

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="min-h-screen bg-gray-50 flex flex-col">
                    <Navbar />
                    <div className="flex-grow">
                        <Routes>
                            <Route path="/" element={<LandingPage />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/feed" element={<HomeFeed />} />
                            <Route path="/report" element={<ReportIssue />} />
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/heatmap" element={<HeatMap />} />
                            <Route path="/issue/:id" element={<IssuePage />} />
                            
                            {/* Admin Routes */}
                            <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
                                <Route index element={<AdminDashboard />} />
                                <Route path="users" element={<AdminUsers />} />
                                <Route path="issues" element={<AdminIssues />} />
                                <Route path="reports" element={<AdminReports />} />
                            </Route>
                        </Routes>
                    </div>
                </div>
            </Router>
        </AuthProvider>
    );
}
export default App;

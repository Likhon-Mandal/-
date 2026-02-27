import React, { useState, useEffect } from 'react';
import { Users, Home, MapPin, Calendar, Bell, Star, Shield, LogOut, Key, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';

const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-6 flex items-center gap-4 hover:shadow-md transition-shadow group">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color} group-hover:scale-110 transition-transform`}>
            <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
            <p className="text-sm text-stone-500 font-sans">{label}</p>
            <p className="text-2xl font-bold text-stone-800 font-serif">{value ?? '—'}</p>
        </div>
    </div>
);

const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchStats = async () => {
        setLoading(true);
        try {
            const res = await api.get('/admin/stats');
            setStats(res.data);
        } catch (err) {
            console.error('Stats error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchStats(); }, []);

    const handleLogout = () => { logout(); navigate('/login'); };

    const statCards = [
        { icon: Users, label: 'Total Members', value: stats?.totalMembers, color: 'bg-orange-700' },
        { icon: Home, label: 'Total Homes', value: stats?.totalHomes, color: 'bg-red-800' },
        { icon: MapPin, label: 'Villages', value: stats?.totalVillages, color: 'bg-yellow-600' },
        { icon: Calendar, label: 'Events', value: stats?.totalEvents, color: 'bg-emerald-700' },
        { icon: Bell, label: 'Notices', value: stats?.totalNotices, color: 'bg-indigo-700' },
        { icon: Star, label: 'Eminent Figures', value: stats?.totalEminentFigures, color: 'bg-purple-700' },
    ];

    return (
        <div className="min-h-screen bg-orange-50">
            {/* Top Bar */}
            <div className="bg-orange-800 text-white px-6 py-4 flex items-center justify-between shadow-lg sticky top-0 z-40">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-yellow-500 flex items-center justify-center">
                        <Shield className="w-5 h-5 text-orange-900" />
                    </div>
                    <div>
                        <p className="font-serif font-bold text-lg">Projenitor Admin</p>
                        <p className="text-xs text-orange-200">Admin Portal</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <span className="hidden sm:block text-sm text-orange-200">{user?.name}</span>
                    <button onClick={() => navigate('/change-password')} className="flex items-center gap-1.5 text-sm bg-orange-700 hover:bg-orange-600 px-3 py-1.5 rounded-lg transition-colors">
                        <Key className="w-4 h-4" /><span className="hidden sm:inline">Change Password</span>
                    </button>
                    <button onClick={handleLogout} className="flex items-center gap-1.5 text-sm bg-red-800 hover:bg-red-700 px-3 py-1.5 rounded-lg transition-colors">
                        <LogOut className="w-4 h-4" /><span className="hidden sm:inline">Logout</span>
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-serif font-bold text-stone-800">Welcome back, {user?.name?.split(' ')[0]}! 👋</h1>
                    <p className="text-stone-500 text-sm mt-1">Here's a snapshot of the Projenitor system.</p>
                </div>

                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-serif font-semibold text-stone-700">System Overview</h2>
                    <button onClick={fetchStats} className="flex items-center gap-1 text-sm text-orange-700 hover:text-orange-900 transition-colors">
                        <RefreshCw className="w-4 h-4" /> Refresh
                    </button>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[...Array(6)].map((_, i) => <div key={i} className="bg-white rounded-xl h-24 animate-pulse border border-orange-100" />)}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {statCards.map((card) => <StatCard key={card.label} {...card} />)}
                    </div>
                )}

                <div className="mt-8 bg-orange-100 border border-orange-200 rounded-xl p-5 text-center">
                    <p className="text-orange-800 text-sm font-medium">
                        You have Admin access. To manage admin accounts, contact a SuperAdmin.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;

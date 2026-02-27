import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';

const ChangePassword = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
    const [showOld, setShowOld] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.newPassword !== form.confirmPassword) {
            setError('New passwords do not match.');
            return;
        }
        if (form.newPassword.length < 6) {
            setError('New password must be at least 6 characters.');
            return;
        }
        setLoading(true);
        try {
            await api.post('/auth/change-password', {
                oldPassword: form.oldPassword,
                newPassword: form.newPassword,
            });
            setSuccess(true);
            setTimeout(() => {
                logout();
                navigate('/login');
            }, 2500);
        } catch (err) {
            setError(err.response?.data?.error || 'Password change failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-orange-50 flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-serif font-bold text-orange-900">Projenitor</h1>
                    <p className="text-stone-500 mt-1 text-sm">Change Your Password</p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl border border-orange-100 overflow-hidden">
                    <div className="bg-orange-800 px-8 py-4">
                        <h2 className="text-white font-serif text-xl font-semibold flex items-center gap-2">
                            <Lock className="w-5 h-5" /> Change Password
                        </h2>
                    </div>

                    <div className="p-8">
                        {success ? (
                            <div className="text-center space-y-4">
                                <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                                <p className="text-green-700 font-medium">Password changed successfully!</p>
                                <p className="text-stone-500 text-sm">Logging you out. Please login with your new password.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-5">
                                {error && (
                                    <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
                                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                        <span>{error}</span>
                                    </div>
                                )}

                                {[
                                    { label: 'Current Password', name: 'oldPassword', show: showOld, toggle: () => setShowOld(!showOld) },
                                    { label: 'New Password', name: 'newPassword', show: showNew, toggle: () => setShowNew(!showNew) },
                                ].map(({ label, name, show, toggle }) => (
                                    <div key={name}>
                                        <label className="block text-sm font-medium text-stone-700 mb-1.5">{label}</label>
                                        <div className="relative">
                                            <input
                                                type={show ? 'text' : 'password'}
                                                name={name}
                                                value={form[name]}
                                                onChange={handleChange}
                                                placeholder="••••••••"
                                                className="w-full border border-orange-200 rounded-lg px-4 py-2.5 text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-orange-50 placeholder-stone-400 pr-10"
                                                required
                                            />
                                            <button type="button" onClick={toggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-orange-700">
                                                {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-1.5">Confirm New Password</label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={form.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="Repeat new password"
                                        className="w-full border border-orange-200 rounded-lg px-4 py-2.5 text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-orange-50 placeholder-stone-400"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-orange-800 hover:bg-orange-900 disabled:opacity-60 text-white font-semibold py-2.5 px-4 rounded-lg transition-all flex items-center justify-center gap-2 shadow-md active:scale-95"
                                >
                                    {loading ? <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" /> : 'Change Password'}
                                </button>
                            </form>
                        )}

                        <div className="mt-6 text-center">
                            <Link to="/" className="text-sm text-orange-700 hover:underline">← Back to Dashboard</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChangePassword;

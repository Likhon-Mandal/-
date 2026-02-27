import React, { useState, useEffect } from 'react';
import { X, CheckCircle2 } from 'lucide-react';
import api from '../api/api';

const NoticeFormModal = ({ isOpen, onClose, onSuccess, initialData }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setTitle(initialData.title || '');
                setContent(initialData.content || '');
                setDate(initialData.date || new Date().toISOString().split('T')[0]);
            } else {
                setTitle('');
                setContent('');
                setDate(new Date().toISOString().split('T')[0]);
            }
        }
    }, [isOpen, initialData]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title.trim() || !content.trim()) {
            return alert('Title and Content are required.');
        }

        setLoading(true);

        const payload = {
            title: title.trim(),
            type: 'General',
            content: content.trim(),
            date,
            posted_by: 'Admin'
        };

        try {
            if (initialData?.id) {
                await api.put(`/notices/${initialData.id}`, payload);
            } else {
                await api.post('/notices', payload);
            }

            if (onSuccess) onSuccess();
            onClose();
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.error || error.message);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6" onClick={onClose}>
            <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"></div>

            <div
                className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-slide-up"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-stone-800 to-stone-600 px-6 py-4 flex justify-between items-center text-white">
                    <h2 className="text-xl font-serif font-bold">{initialData ? 'Edit Notice' : 'Add New Notice'}</h2>
                    <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Form Body */}
                <div className="p-6">
                    <form id="notice-form" onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-stone-700 mb-1">Title *</label>
                            <input
                                type="text"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                placeholder="e.g. 94th Annual Gathering Announced"
                                className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-sm"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-stone-700 mb-1">Event Date *</label>
                            <input
                                type="date"
                                value={date}
                                onChange={e => setDate(e.target.value)}
                                className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 transition-all text-sm font-medium"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-stone-700 mb-1">Content *</label>
                            <textarea
                                value={content}
                                onChange={e => setContent(e.target.value)}
                                placeholder="Provide the details of the announcement here..."
                                rows="4"
                                className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-sm resize-none"
                                required
                            ></textarea>
                        </div>
                    </form>
                </div>

                {/* Footer Controls */}
                <div className="border-t border-stone-100 p-4 bg-stone-50 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2 text-stone-600 font-bold hover:bg-stone-200 border border-stone-300 rounded-lg transition-colors"
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="notice-form"
                        disabled={loading}
                        className="px-6 py-2 bg-orange-700 hover:bg-orange-800 text-white font-bold rounded-lg shadow-md transition-all active:scale-95 flex items-center gap-2 disabled:opacity-50"
                    >
                        {loading ? 'Saving...' : <><CheckCircle2 size={18} /> {initialData ? 'Save Changes' : 'Publish Notice'}</>}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NoticeFormModal;

import React, { useState, useEffect } from 'react';
import { X, CheckCircle2 } from 'lucide-react';
import api from '../api/api';

const EventFormModal = ({ isOpen, onClose, onSuccess, initialData }) => {
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setTitle(initialData.title || '');
                setDate(initialData.date || '');
                setTime(initialData.time || '');
                setLocation(initialData.location || '');
                setDescription(initialData.description || '');
            } else {
                setTitle('');
                setDate('');
                setTime('');
                setLocation('');
                setDescription('');
            }
        }
    }, [isOpen, initialData]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title.trim() || !date.trim()) {
            return alert('Title and Date are required.');
        }

        setLoading(true);

        const payload = {
            title: title.trim(),
            date: date.trim(), // Storing as string representation e.g. "March 15, 2026" or raw date
            time: time.trim(),
            location: location.trim(),
            description: description.trim()
        };

        try {
            if (initialData?.id) {
                await api.put(`/events/${initialData.id}`, payload);
            } else {
                await api.post('/events', payload);
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
                    <h2 className="text-xl font-serif font-bold">{initialData ? 'Edit Event' : 'Create New Event'}</h2>
                    <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Form Body */}
                <div className="p-6">
                    <form id="event-form" onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-stone-700 mb-1">Event Title *</label>
                            <input
                                type="text"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                placeholder="e.g. 94th Annual Gathering"
                                className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-sm"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-stone-700 mb-1">Date *</label>
                                <input
                                    type="date"
                                    value={date}
                                    onChange={e => setDate(e.target.value)}
                                    className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 transition-all text-sm"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-stone-700 mb-1">Time</label>
                                <input
                                    type="time"
                                    value={time}
                                    onChange={e => setTime(e.target.value)}
                                    className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 transition-all text-sm font-medium"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-stone-700 mb-1">Location</label>
                            <input
                                type="text"
                                value={location}
                                onChange={e => setLocation(e.target.value)}
                                placeholder="e.g. Madaripur Ancestral Home"
                                className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 transition-all text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-stone-700 mb-1">Description</label>
                            <textarea
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                placeholder="Provide the details of the event here..."
                                rows="3"
                                className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-sm resize-none"
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
                        form="event-form"
                        disabled={loading}
                        className="px-6 py-2 bg-orange-700 hover:bg-orange-800 text-white font-bold rounded-lg shadow-md transition-all active:scale-95 flex items-center gap-2 disabled:opacity-50"
                    >
                        {loading ? 'Saving...' : <><CheckCircle2 size={18} /> {initialData ? 'Save Changes' : 'Create Event'}</>}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EventFormModal;

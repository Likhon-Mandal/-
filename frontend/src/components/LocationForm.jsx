import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import api from '../api/api';

const LocationForm = ({ isOpen, onClose, level, parentName, onSuccess }) => {
    const [name, setName] = useState('');
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!name.trim()) return;

        try {
            await api.post('/family/location', { level, name, parentName });
            setName('');
            onSuccess();
            onClose();
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || 'Failed to add location');
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 animate-fade-in text-left">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-serif text-orange-900 font-bold capitalize">
                        Add New {level}
                    </h3>
                    <button onClick={onClose} className="text-stone-400 hover:text-stone-600">
                        <X size={20} />
                    </button>
                </div>

                {parentName && (
                    <p className="text-sm text-stone-500 mb-4">
                        Adding under: <span className="font-bold text-orange-800">{parentName}</span>
                    </p>
                )}

                {error && <p className="text-red-600 text-sm mb-2">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-stone-500 uppercase mb-1">
                            {level} Name *
                        </label>
                        <input
                            type="text"
                            required
                            autoFocus
                            className="w-full p-2 border rounded border-orange-200 focus:border-orange-500 outline-none"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder={`Enter ${level} name`}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-orange-600 text-white font-bold py-2 rounded-lg hover:bg-orange-700 transition flex justify-center gap-2 items-center"
                    >
                        <Save size={18} /> Save {level}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LocationForm;

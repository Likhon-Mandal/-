import React, { useState, useEffect } from 'react';
import { Trash2, AlertCircle, RefreshCw, ArchiveRestore } from 'lucide-react';
import ConfirmModal from '../components/ConfirmModal';
import api from '../api/api';

const RecycleBin = () => {
    const [deletedData, setDeletedData] = useState({
        members: [],
        countries: [],
        divisions: [],
        districts: [],
        upazilas: [],
        villages: [],
        homes: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, item: null, table: null });

    const fetchRecycleBin = async () => {
        try {
            setLoading(true);
            const res = await api.get('/system/recycle-bin');
            setDeletedData(res.data);
        } catch (err) {
            setError(err.response?.data?.error || err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecycleBin();
    }, []);

    const handleRestoreConfirm = async () => {
        const { item, table } = confirmModal;
        if (!item || !table) return;

        try {
            setConfirmModal({ ...confirmModal, isOpen: false });
            await api.put(`/system/restore/${table}/${item.id}`);
            fetchRecycleBin();
        } catch (err) {
            alert('Error restoring: ' + (err.response?.data?.error || err.message));
        }
    };

    const triggerRestore = (item, table) => {
        setConfirmModal({
            isOpen: true,
            item,
            table,
            title: `Restore ${item.name || item.full_name}?`,
            message: `Are you sure you want to restore "${item.name || item.full_name}"? If this is a geographic location, all of its nested children will also be automatically restored.`
        });
    };

    const calculateTotalItems = () => {
        return Object.values(deletedData).reduce((sum, arr) => sum + arr.length, 0);
    };

    if (loading) return <div className="text-center py-20 animate-pulse text-stone-500 font-medium">Loading Recycle Bin...</div>;
    if (error) return <div className="text-center py-20 text-red-500 font-bold">{error}</div>;

    const totalItems = calculateTotalItems();

    return (
        <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in relative">
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(#9a3412 1px, transparent 1px)', backgroundSize: '16px 16px' }}>
            </div>

            <div className="relative z-10">
                <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-serif font-bold text-stone-900 flex items-center gap-3">
                            <Trash2 className="text-red-600" size={32} />
                            Recycle Bin
                        </h1>
                        <p className="text-stone-500 mt-2 font-medium">Restore recently deleted geographic locations and members.</p>
                    </div>
                </div>

                {totalItems === 0 ? (
                    <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-stone-200 flex flex-col items-center">
                        <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center mb-4 text-stone-300">
                            <Trash2 size={40} />
                        </div>
                        <h3 className="text-xl font-bold text-stone-700 font-serif mb-2">The recycle bin is empty</h3>
                        <p className="text-stone-500">No members or locations have been deleted recently.</p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {/* Render Sections dynamically */}
                        {Object.entries(deletedData).map(([table, items]) => {
                            if (items.length === 0) return null;

                            // Formatting table name for display
                            const displayTable = table.charAt(0).toUpperCase() + table.slice(1);

                            return (
                                <div key={table} className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
                                    <div className="bg-stone-50 border-b border-stone-200 px-6 py-4 flex items-center justify-between">
                                        <h2 className="font-bold text-stone-800 text-lg">{displayTable} ({items.length})</h2>
                                    </div>
                                    <ul className="divide-y divide-stone-100">
                                        {items.map(item => (
                                            <li key={item.id} className="p-4 hover:bg-orange-50/50 transition-colors flex items-center justify-between group">
                                                <div>
                                                    <span className="font-medium text-stone-800 text-lg">{item.name || item.full_name}</span>
                                                    <div className="text-xs text-stone-400 mt-1 flex items-center gap-1">
                                                        <AlertCircle size={12} />
                                                        Deleted: {new Date(item.deleted_at).toLocaleString()}
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => triggerRestore(item, table)}
                                                    className="flex items-center gap-2 px-4 py-2 bg-stone-100 text-stone-700 rounded-lg hover:bg-orange-600 hover:text-white transition-all shadow-sm font-medium text-sm opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0"
                                                >
                                                    <ArchiveRestore size={16} /> Restore
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Reuse generic confirmation modal */}
            <ConfirmModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
                onConfirm={handleRestoreConfirm}
                title={confirmModal.title}
                message={confirmModal.message}
                confirmText="Restore"
            />
        </div>
    );
};

export default RecycleBin;

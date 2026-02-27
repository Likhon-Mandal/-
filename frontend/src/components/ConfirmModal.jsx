import React from 'react';
import { AlertTriangle, X, ArchiveRestore } from 'lucide-react';

const ConfirmModal = ({ isOpen, onClose, onConfirm, message, title = "Confirm Deletion", confirmText = "Delete" }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden relative animate-in fade-in zoom-in duration-200">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 p-2 text-stone-400 hover:text-stone-800 hover:bg-stone-100 rounded-full transition-colors"
                >
                    <X size={18} />
                </button>

                <div className="px-6 pt-8 pb-6 flex flex-col items-center text-center">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 inner-shadow-sm ${confirmText === 'Restore' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                        {confirmText === 'Restore' ? <ArchiveRestore size={32} /> : <AlertTriangle size={32} />}
                    </div>

                    <h2 className="text-2xl font-serif font-bold text-stone-900 mb-2">
                        {title}
                    </h2>

                    <p className="text-stone-600 text-sm mb-8 leading-relaxed px-4">
                        {message}
                    </p>

                    <div className="flex gap-3 w-full">
                        <button
                            onClick={onClose}
                            className="flex-1 py-3 px-4 bg-stone-100 text-stone-800 font-medium rounded-xl hover:bg-stone-200 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => {
                                onConfirm();
                                onClose();
                            }}
                            className={`flex-1 py-3 px-4 text-white font-medium rounded-xl shadow-md transition-all hover:-translate-y-0.5 ${confirmText === 'Restore'
                                ? 'bg-green-600 hover:bg-green-700 shadow-green-600/20'
                                : 'bg-red-600 hover:bg-red-700 shadow-red-600/20'
                                }`}
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;

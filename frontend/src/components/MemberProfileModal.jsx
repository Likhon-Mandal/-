import React from 'react';
import { X, MapPin, Briefcase, Calendar, Droplet, User, Edit, Trash2 } from 'lucide-react';

const MemberProfileModal = ({ member, isOpen, onClose, onEdit, onDelete }) => {
    if (!isOpen || !member) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden relative animate-in fade-in zoom-in duration-200">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full backdrop-blur-md transition-colors"
                >
                    <X size={18} />
                </button>

                {/* Header / Cover */}
                <div className="h-32 bg-gradient-to-br from-orange-700 via-orange-600 to-yellow-500 relative">
                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>
                </div>

                {/* Profile Content */}
                <div className="px-6 pb-6 relative">
                    {/* Avatar */}
                    <div className="-mt-16 mb-4 flex justify-between items-end">
                        <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg bg-orange-50 overflow-hidden flex-shrink-0">
                            {member.profile_image_url ? (
                                <img
                                    src={member.profile_image_url}
                                    alt={member.full_name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-orange-800 opacity-50">
                                    <User size={48} />
                                </div>
                            )}
                        </div>

                        {/* Actions Suite */}
                        <div className="flex flex-col gap-2 items-end mb-2">
                            {/* Edit Button */}
                            <button
                                onClick={() => {
                                    onEdit(member);
                                    onClose();
                                }}
                                className="flex items-center gap-2 px-4 py-2 bg-stone-800 text-white text-sm font-medium rounded-full hover:bg-stone-700 transition-colors shadow-sm"
                            >
                                <Edit size={14} /> Edit
                            </button>

                            {/* Delete Button */}
                            {onDelete && (
                                <button
                                    onClick={() => {
                                        onDelete(member);
                                        onClose();
                                    }}
                                    className="flex items-center gap-2 px-4 py-2 border border-red-200 text-red-600 bg-white text-sm font-medium rounded-full hover:bg-red-50 transition-colors shadow-sm"
                                >
                                    <Trash2 size={14} /> Delete
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Basic Info */}
                    <div className="mb-6">
                        <h2 className="text-2xl font-serif font-bold text-stone-900 leading-tight">
                            {member.full_name}
                        </h2>
                        <div className="flex items-center gap-2 text-orange-700 font-medium mt-1">
                            {member.occupation && (
                                <span className="flex items-center gap-1 text-sm uppercase tracking-wide">
                                    <Briefcase size={14} /> {member.occupation}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                        <div className="bg-stone-50 p-3 rounded-xl border border-stone-100">
                            <div className="text-xs text-stone-400 uppercase tracking-wider font-bold mb-1 flex items-center gap-1">
                                <Droplet size={10} /> Blood Group
                            </div>
                            <div className="text-stone-800 font-bold">{member.blood_group || 'N/A'}</div>
                        </div>
                        <div className="bg-stone-50 p-3 rounded-xl border border-stone-100">
                            <div className="text-xs text-stone-400 uppercase tracking-wider font-bold mb-1 flex items-center gap-1">
                                <MapPin size={10} /> Location
                            </div>
                            <div className="text-stone-800 font-bold truncate" title={member.location}>
                                {member.location || 'Unknown'}
                            </div>
                        </div>
                        <div className="bg-stone-50 p-3 rounded-xl border border-stone-100 col-span-2">
                            <div className="text-xs text-stone-400 uppercase tracking-wider font-bold mb-1 flex items-center gap-1">
                                <Calendar size={10} /> Born
                            </div>
                            <div className="text-stone-800 font-bold">
                                {member.birth_date ? new Date(member.birth_date).toLocaleDateString() : 'Unknown'}
                                {member.alive === false && member.death_date && (
                                    <span className="text-stone-400 font-normal"> — {new Date(member.death_date).toLocaleDateString()}</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Bio / Additional Info */}
                    {member.bio && (
                        <div className="text-sm text-stone-600 leading-relaxed italic border-t pt-4">
                            "{member.bio}"
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MemberProfileModal;

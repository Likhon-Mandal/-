import React, { useState, useEffect } from 'react';
import { Save, X } from 'lucide-react';
import api from '../api/api';

/* 
  Reusable Member Form Component
  - Handles Create/Update logic.
  - Can be pre-filled with initial data (e.g., geographic info).
  - Used in Admin and Explorer pages.
*/
const MemberForm = ({ isOpen, onClose, initialData = {}, onSuccess }) => {
    const [formData, setFormData] = useState({
        full_name: '', gender: '', blood_group: '', occupation: '', education: '',
        birth_date: '', death_date: '', is_alive: true,
        contact_number: '', email: '', present_address: '', permanent_address: '',
        country: 'Bangladesh', division: '', district: '', upazila: '', village: '', home_name: '',
        father_id: '', mother_id: '', spouse_id: '', profile_image_url: '', bio: '',
        workplace: '', social_media: '',
        level: 1, isRoot: true,
        ...initialData // Override defaults with initialData if provided
    });

    const [members, setMembers] = useState([]);
    const [possibleFathers, setPossibleFathers] = useState([]);
    const [possibleMothers, setPossibleMothers] = useState([]);
    const [loading, setLoading] = useState(false);

    // If initialData changes (e.g. when opening form with different context), update state
    useEffect(() => {
        if (isOpen) {
            setFormData(prev => ({
                ...prev,
                ...initialData,
                // Ensure isRoot is correctly set based on father_id presence in initialData if it differs from default
                isRoot: initialData.id ? !initialData.father_id : (initialData.father_id ? false : prev.isRoot)
            }));
            fetchMembers();
        }
    }, [isOpen, initialData]);

    // Level calculation logic
    useEffect(() => {
        if (formData.isRoot) {
            // Do not auto-reset level here, allow user to set it manually
            setFormData(prev => ({ ...prev, father_id: '' }));
        } else if (formData.father_id) {
            const father = members.find(m => m.id === formData.father_id);
            if (father) {
                setFormData(prev => ({ ...prev, level: (father.level || 0) + 1 }));
            }
        }
    }, [formData.father_id, formData.isRoot, members]);

    const fetchMembers = async () => {
        try {
            setLoading(true);
            const res = await api.get('/members');
            const data = res.data;
            setMembers(data);
            setPossibleFathers(data);
            setPossibleMothers(data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const uploadData = new FormData();
        uploadData.append('image', file);

        try {
            const res = await api.post('/upload', uploadData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (res.data.filePath) {
                setFormData(prev => ({ ...prev, profile_image_url: res.data.filePath }));
            }
        } catch (err) {
            console.error(err);
            alert('Error uploading image: ' + (err.response?.data?.error || err.message));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const editingId = initialData.id;
        const payload = { ...formData };

        // Remove null bytes from any string to prevent PostgreSQL UTF8 0x00 errors
        Object.keys(payload).forEach(key => {
            if (typeof payload[key] === 'string') {
                payload[key] = payload[key].replace(/\0/g, '');
            }
        });

        if (formData.isRoot) {
            payload.father_id = null;
        }
        // Handle optional fields
        if (!payload.mother_id) payload.mother_id = null;
        if (!payload.spouse_id) payload.spouse_id = null;
        if (!payload.father_id) payload.father_id = null;

        delete payload.isRoot;

        try {
            if (editingId) {
                await api.put(`/members/${editingId}`, payload);
            } else {
                await api.post('/members', payload);
            }
            onSuccess();
            onClose();
        } catch (err) {
            console.error(err);
            alert('Error saving data: ' + (err.response?.data?.error || err.message));
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl p-6 animate-fade-in text-left max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-serif text-orange-900 font-bold">
                        {initialData.id ? 'Edit Member' : 'Add New Member'}
                    </h2>
                    <button onClick={onClose} className="text-stone-400 hover:text-stone-600">
                        <X size={24} />
                    </button>
                </div>

                {loading ? (
                    <div className="text-center py-10">Loading form data...</div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Section: Basic Info */}
                        <div>
                            <h3 className="text-lg font-bold text-orange-800 border-b border-orange-100 pb-2 mb-3">Basic Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Full Name *</label>
                                    <input type="text" required className="w-full p-2 border rounded" value={formData.full_name} onChange={e => setFormData({ ...formData, full_name: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Gender</label>
                                    <select className="w-full p-2 border rounded" value={formData.gender} onChange={e => setFormData({ ...formData, gender: e.target.value })}>
                                        <option value="">Select</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Blood Group</label>
                                    <select className="w-full p-2 border rounded" value={formData.blood_group} onChange={e => setFormData({ ...formData, blood_group: e.target.value })}>
                                        <option value="">Unknown</option>
                                        <option value="A+">A+</option> <option value="A-">A-</option>
                                        <option value="B+">B+</option> <option value="B-">B-</option>
                                        <option value="O+">O+</option> <option value="O-">O-</option>
                                        <option value="AB+">AB+</option> <option value="AB-">AB-</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Occupation</label>
                                    <input type="text" className="w-full p-2 border rounded" value={formData.occupation} onChange={e => setFormData({ ...formData, occupation: e.target.value })} placeholder="e.g. Engineer" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Workplace</label>
                                    <input type="text" className="w-full p-2 border rounded" value={formData.workplace} onChange={e => setFormData({ ...formData, workplace: e.target.value })} placeholder="e.g. Google, Dhaka" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Education</label>
                                    <input type="text" className="w-full p-2 border rounded" value={formData.education} onChange={e => setFormData({ ...formData, education: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Is Alive?</label>
                                    <select className="w-full p-2 border rounded" value={formData.is_alive} onChange={e => setFormData({ ...formData, is_alive: e.target.value === 'true' })}>
                                        <option value="true">Yes</option>
                                        <option value="false">No</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Birth Date</label>
                                    <input type="date" className="w-full p-2 border rounded" value={formData.birth_date ? formData.birth_date.split('T')[0] : ''} onChange={e => setFormData({ ...formData, birth_date: e.target.value })} />
                                </div>
                                {!formData.is_alive && (
                                    <div>
                                        <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Death Date</label>
                                        <input type="date" className="w-full p-2 border rounded" value={formData.death_date ? formData.death_date.split('T')[0] : ''} onChange={e => setFormData({ ...formData, death_date: e.target.value })} />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Section: Relationships */}
                        <div>
                            <h3 className="text-lg font-bold text-orange-800 border-b border-orange-100 pb-2 mb-3">Family Relationships</h3>
                            {!initialData.father_id && (
                                <div className="flex gap-4 mb-4">
                                    <label className="flex items-center gap-2 cursor-pointer border p-2 rounded hover:bg-orange-50">
                                        <input type="radio" checked={formData.isRoot} onChange={() => setFormData({ ...formData, isRoot: true })} />
                                        <span className="font-bold text-sm">Review as Root (Manual Level)</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer border p-2 rounded hover:bg-orange-50">
                                        <input type="radio" checked={!formData.isRoot} onChange={() => setFormData({ ...formData, isRoot: false })} />
                                        <span className="font-bold text-sm">Has Father (Gen {formData.level})</span>
                                    </label>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {formData.isRoot ? (
                                    <div>
                                        <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Generation Level</label>
                                        <input
                                            type="number"
                                            min="1"
                                            className="w-full p-2 border rounded"
                                            value={formData.level}
                                            onChange={e => setFormData({ ...formData, level: parseInt(e.target.value) || 1 })}
                                        />
                                        <p className="text-xs text-stone-400 mt-1">Manual level for House Root (e.g., 1, 9, etc.)</p>
                                    </div>
                                ) : (
                                    <div>
                                        <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Father *</label>
                                        {initialData.father_id ? (
                                            <input
                                                type="text"
                                                className="w-full p-2 border rounded bg-stone-100 text-stone-600 font-bold"
                                                value={possibleFathers.find(m => m.id === formData.father_id)?.full_name || 'Auto-linked to Parent'}
                                                readOnly
                                                disabled
                                            />
                                        ) : (
                                            <select className="w-full p-2 border rounded" value={formData.father_id || ''} onChange={e => setFormData({ ...formData, father_id: e.target.value })}>
                                                <option value="">Select Father</option>
                                                {possibleFathers.map(m => <option key={m.id} value={m.id}>{m.full_name} (Gen {m.level})</option>)}
                                            </select>
                                        )}
                                    </div>
                                )}
                                <div>
                                    <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Mother</label>
                                    <select className="w-full p-2 border rounded" value={formData.mother_id || ''} onChange={e => setFormData({ ...formData, mother_id: e.target.value })}>
                                        <option value="">Select Mother</option>
                                        {possibleMothers.map(m => <option key={m.id} value={m.id}>{m.full_name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Spouse</label>
                                    <select className="w-full p-2 border rounded" value={formData.spouse_id || ''} onChange={e => setFormData({ ...formData, spouse_id: e.target.value })}>
                                        <option value="">Select Spouse</option>
                                        {members.map(m => <option key={m.id} value={m.id}>{m.full_name}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Section: Contact & Location */}
                        <div>
                            <h3 className="text-lg font-bold text-orange-800 border-b border-orange-100 pb-2 mb-3">Contact & Location</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="col-span-1 md:col-span-2 lg:col-span-2">
                                    <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Phone Number</label>
                                    <input type="text" className="w-full p-2 border rounded" value={formData.contact_number} onChange={e => setFormData({ ...formData, contact_number: e.target.value })} placeholder="+8801XXXXXXXXX" />
                                </div>
                                <div className="col-span-1 md:col-span-2 lg:col-span-2">
                                    <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Social Media Link</label>
                                    <input type="text" className="w-full p-2 border rounded" value={formData.social_media} onChange={e => setFormData({ ...formData, social_media: e.target.value })} placeholder="https://facebook.com/..." />
                                </div>

                                {/* Auto-filled geographic data can be edited here */}
                                <div>
                                    <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Division</label>
                                    <input type="text" className="w-full p-2 border rounded" value={formData.division} onChange={e => setFormData({ ...formData, division: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-stone-500 uppercase mb-1">District</label>
                                    <input type="text" className="w-full p-2 border rounded" value={formData.district} onChange={e => setFormData({ ...formData, district: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Upazila</label>
                                    <input type="text" className="w-full p-2 border rounded" value={formData.upazila} onChange={e => setFormData({ ...formData, upazila: e.target.value })} />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Village</label>
                                    <input type="text" className="w-full p-2 border rounded" value={formData.village} onChange={e => setFormData({ ...formData, village: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Home Name</label>
                                    <input type="text" className="w-full p-2 border rounded" value={formData.home_name} onChange={e => setFormData({ ...formData, home_name: e.target.value })} />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Present Address</label>
                                    <input type="text" className="w-full p-2 border rounded" value={formData.present_address} onChange={e => setFormData({ ...formData, present_address: e.target.value })} />
                                </div>
                            </div>
                        </div>

                        {/* Section: Bio & Media */}
                        <div>
                            <h3 className="text-lg font-bold text-orange-800 border-b border-orange-100 pb-2 mb-3">Bio & Media</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Profile Image</label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="w-full p-2 border rounded"
                                            onChange={handleImageUpload}
                                        />
                                    </div>
                                    {formData.profile_image_url && (
                                        <div className="mt-2 text-xs text-green-600">
                                            Image Uploaded: <a href={formData.profile_image_url} target="_blank" rel="noreferrer" className="underline">View</a>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Bio</label>
                                    <textarea className="w-full p-2 border rounded h-20" value={formData.bio} onChange={e => setFormData({ ...formData, bio: e.target.value })}></textarea>
                                </div>
                            </div>
                        </div>

                        <button type="submit" className="w-full bg-orange-600 text-white font-bold py-3 rounded-lg hover:bg-orange-700 transition shadow-lg mt-4 flex justify-center gap-2">
                            <Save size={20} /> {initialData.id ? 'Update Member' : 'Create Member'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default MemberForm;

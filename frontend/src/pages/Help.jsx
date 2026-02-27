import React, { useState, useEffect } from 'react';
import { HelpCircle, Search, MessageCircle, PlusCircle, Trash2, Edit2 } from 'lucide-react';
import HelpRequestModal from '../components/HelpRequestModal';

const Help = () => {
    const [helpRequests, setHelpRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRequest, setEditingRequest] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchHelpData = async () => {
        try {
            setLoading(true);
            const res = await fetch('http://localhost:5001/api/help');
            if (res.ok) {
                const data = await res.json();
                setHelpRequests(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHelpData();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this specific request?")) return;
        try {
            const res = await fetch(`http://localhost:5001/api/help/${id}`, { method: 'DELETE' });
            if (res.ok) fetchHelpData();
        } catch (error) {
            console.error(error);
        }
    };

    const filteredRequests = helpRequests.filter(req =>
        req.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (req.content && req.content.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 animate-slide-up">
                <div>
                    <h1 className="text-4xl font-serif font-bold text-primary flex items-center gap-3">
                        <HelpCircle className="h-10 w-10 text-secondary" />
                        Help Desk
                    </h1>
                    <p className="text-stone-500 mt-2">Ask for help or offer support to community members.</p>
                </div>
                <button
                    onClick={() => { setEditingRequest(null); setIsModalOpen(true); }}
                    className="bg-primary text-white px-6 py-3 rounded-md hover:bg-orange-900 transition flex items-center gap-2 shadow-sm hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 duration-200"
                >
                    <PlusCircle className="h-5 w-5" />
                    New Request
                </button>
            </div>

            {/* Search Bar */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-orange-100 flex gap-2 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <Search className="h-5 w-5 text-stone-400 my-auto ml-2" />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search requests..."
                    className="flex-1 outline-none text-stone-700 bg-transparent"
                />
            </div>

            {/* Posts List */}
            <div className="space-y-4">
                {loading ? (
                    <div className="bg-white p-8 rounded-lg text-center shadow-sm border border-stone-100 text-stone-400 animate-pulse font-medium">
                        Loading help requests...
                    </div>
                ) : filteredRequests.length > 0 ? (
                    filteredRequests.map((post, index) => (
                        <div
                            key={post.id}
                            className="bg-white p-6 rounded-lg shadow-sm border border-orange-100 hover:border-accent hover:shadow-md transition duration-300 animate-slide-up relative group"
                            style={{ animationDelay: `${0.1 * (index + 1)}s` }}
                        >
                            <div className="absolute top-4 right-4 flex gap-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => { setEditingRequest(post); setIsModalOpen(true); }}
                                    className="p-1.5 text-stone-300 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                                    title="Edit Request"
                                >
                                    <Edit2 size={16} />
                                </button>
                                <button
                                    onClick={() => handleDelete(post.id)}
                                    className="p-1.5 text-stone-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Delete Request"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            <div className="flex justify-between items-start mb-2 pr-16">
                                <span className={`px-2 py-1 rounded text-xs font-bold uppercase transition-colors cursor-default ${post.type === 'alert' ? 'bg-red-100 text-red-800 hover:bg-red-200' : 'bg-orange-100 text-orange-800 hover:bg-orange-200'}`}>{post.tag}</span>
                                <span className="text-sm text-stone-400">Posted by {post.posted_by}</span>
                            </div>
                            <h3 className="text-xl font-bold text-stone-800 mb-2 hover:text-primary transition-colors cursor-pointer">{post.title}</h3>
                            <p className="text-stone-600 mb-4 whitespace-pre-wrap">{post.content}</p>
                            <div className="flex gap-4">
                                <button className="text-secondary font-medium text-sm flex items-center hover:underline hover:text-red-800 transition-colors">
                                    <MessageCircle className="h-4 w-4 mr-1" />
                                    Reply / Offer Help Manually
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="bg-white p-8 rounded-lg text-center shadow-sm border border-stone-100 text-stone-500 font-medium">
                        No help requests found.
                    </div>
                )}
            </div>

            <HelpRequestModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchHelpData}
                initialData={editingRequest}
            />
        </div>
    );
};

export default Help;

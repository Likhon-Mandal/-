import React, { useState } from 'react';
import { HelpCircle, Search, MessageCircle, PlusCircle } from 'lucide-react';

const Help = () => {
    // Mock Data
    const posts = [
        { id: 1, user: 'Rahim Barai', title: 'Looking for 1971 records of grandfather', type: 'Research', content: 'I am trying to find documents related to my grandfather...' },
        { id: 2, user: 'Sumitra Devi', title: 'Need blood donor B+ in Dhaka', type: 'Medical', content: 'Urgent need for B+ blood at DMCH...' },
        { id: 3, user: 'Kamal Barai', title: 'Financial aid for education', type: 'Education', content: 'Seeking scholarship information for university...' }
    ];

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
                <button className="bg-primary text-white px-6 py-3 rounded-md hover:bg-orange-900 transition flex items-center gap-2 shadow-sm hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 duration-200">
                    <PlusCircle className="h-5 w-5" />
                    New Request
                </button>
            </div>

            {/* Search Bar */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-orange-100 flex gap-2 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <Search className="h-5 w-5 text-stone-400 my-auto ml-2" />
                <input 
                    type="text" 
                    placeholder="Search requests..." 
                    className="flex-1 outline-none text-stone-700 bg-transparent"
                />
            </div>

            {/* Posts List */}
            <div className="space-y-4">
                {posts.map((post, index) => (
                    <div 
                        key={post.id} 
                        className="bg-white p-6 rounded-lg shadow-sm border border-orange-100 hover:border-accent hover:shadow-md transition duration-300 animate-slide-up"
                        style={{ animationDelay: `${0.1 * (index + 2)}s` }}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs font-bold uppercase hover:bg-orange-200 transition-colors cursor-default">{post.type}</span>
                            <span className="text-sm text-stone-400">Posted by {post.user}</span>
                        </div>
                        <h3 className="text-xl font-bold text-stone-800 mb-2 hover:text-primary transition-colors cursor-pointer">{post.title}</h3>
                        <p className="text-stone-600 mb-4">{post.content}</p>
                        <div className="flex gap-4">
                            <button className="text-secondary font-medium text-sm flex items-center hover:underline hover:text-red-800 transition-colors">
                                <MessageCircle className="h-4 w-4 mr-1" />
                                Reply / Offer Help
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Help;

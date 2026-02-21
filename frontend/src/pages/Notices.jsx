import React, { useState } from 'react';
import { Bell, Calendar, HelpCircle } from 'lucide-react';

const Notices = () => {
    // Mock Data
    const notices = [
        {
            id: 1,
            title: '94th Annual Gathering Announced',
            date: '2025-02-22',
            type: 'Event',
            content: 'The 94th Annual Gathering will be held at the ancestral home in Madaripur on 10th Falgun. All members are requested to attend.',
            posted_by: 'Committee'
        },
        {
            id: 2,
            title: 'Book Update Initiative',
            date: '2024-11-15',
            type: 'News',
            content: 'We are starting the data collection for the updated ancestral book. Please verify your profiles online.',
            posted_by: 'Admin'
        }
    ];

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
            <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-secondary flex items-start space-x-4 animate-slide-up">
                <div className="bg-orange-100 p-3 rounded-full">
                    <Bell className="h-6 w-6 text-secondary" />
                </div>
                <div>
                    <h1 className="text-2xl font-serif font-bold text-primary">Community Board</h1>
                    <p className="text-stone-600">Stay updated with the latest news, events, and announcements.</p>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-4">
                    <h2 className="text-xl font-serif font-bold text-stone-800 mb-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>Latest Notices</h2>
                    {notices.map((notice, index) => (
                        <div 
                            key={notice.id} 
                            className="bg-white p-6 rounded-lg shadow-sm border border-orange-100 hover:shadow-md transition duration-300 animate-slide-up"
                            style={{ animationDelay: `${0.1 * (index + 2)}s` }}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wide cursor-default ${notice.type === 'Event' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                                    {notice.type}
                                </span>
                                <span className="text-sm text-stone-400 flex items-center">
                                    <Calendar className="h-3 w-3 mr-1" />
                                    {notice.date}
                                </span>
                            </div>
                            <h3 className="text-xl font-bold text-primary mb-2 hover:text-red-800 transition-colors cursor-pointer">{notice.title}</h3>
                            <p className="text-stone-600 mb-4">{notice.content}</p>
                            <div className="text-sm text-stone-400">Posted by: {notice.posted_by}</div>
                        </div>
                    ))}
                </div>

                <div className="space-y-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-orange-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center space-x-2 mb-4 text-accent">
                            <HelpCircle className="h-6 w-6 animate-pulse" />
                            <h3 className="text-lg font-bold">Help Desk</h3>
                        </div>
                        <p className="text-sm text-stone-600 mb-4">
                            Need assistance updating your profile or finding a relative?
                        </p>
                        <button className="w-full bg-white border-2 border-accent text-stone-800 py-2 rounded hover:bg-yellow-50 transition font-medium transform hover:scale-[1.02] active:scale-[0.98]">
                            Contact Support
                        </button>
                    </div>

                    <div className="bg-primary text-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
                        <h3 className="text-lg font-serif font-bold mb-2">Committee Members</h3>
                        <ul className="space-y-2 text-sm opacity-90">
                            <li>President: [Name Placeholder]</li>
                            <li>Secretary: [Name Placeholder]</li>
                            <li>Treasurer: [Name Placeholder]</li>
                        </ul>
                        <button className="mt-4 text-xs text-orange-200 hover:text-white underline transition-colors">
                            View Full Committee
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Notices;

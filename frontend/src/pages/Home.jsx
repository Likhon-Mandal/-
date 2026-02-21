import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, HelpCircle, Star, ArrowRight, User, Calendar, MapPin, Activity, ChevronRight, AlertCircle } from 'lucide-react';
import ImageSlider from '../components/ImageSlider';

/* ANIMATION STYLES */
const AnimationStyles = () => (
    <style>{`
        @keyframes fadeSlideUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-up { animation: fadeSlideUp 0.8s ease-out forwards; }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        
        .glass-panel {
            background: rgba(255, 255, 255, 0.65);
            backdrop-filter: blur(16px) saturate(180%);
            border: 1px solid rgba(255, 255, 255, 0.5);
            box-shadow: 0 8px 32px 0 rgba(154, 52, 18, 0.1);
        }
        
        .glass-item {
            background: rgba(255, 255, 255, 0.4);
            border: 1px solid rgba(255, 255, 255, 0.3);
            transition: all 0.3s ease;
        }
        .glass-item:hover {
            background: white;
            transform: translateX(4px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.05);
            border-color: rgba(234, 88, 12, 0.2);
        }

        /* Custom Scrollbar for Lists */
        .custom-scroll::-webkit-scrollbar { width: 4px; }
        .custom-scroll::-webkit-scrollbar-track { background: rgba(0,0,0,0.02); }
        .custom-scroll::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 4px; }
    `}</style>
);

/* List Item Component */
const ListItem = ({ icon: Icon, title, date, tag, type }) => (
    <div className="glass-item p-4 rounded-xl flex items-start gap-4 cursor-pointer group mb-3">
        <div className={`p-3 rounded-xl shrink-0 ${type === 'alert' ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'}`}>
            <Icon size={20} />
        </div>
        <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between mb-1">
                <span className={`text-[10px] uppercase font-bold tracking-wider ${type === 'alert' ? 'text-red-500' : 'text-orange-500'}`}>{tag}</span>
                <span className="text-[10px] text-stone-400 font-medium">{date}</span>
            </div>
            <h4 className="text-base font-bold text-stone-800 leading-snug group-hover:text-primary transition-colors line-clamp-2">
                {title}
            </h4>
        </div>
        <div className="self-center opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0">
            <ChevronRight size={16} className="text-stone-400" />
        </div>
    </div>
);

/* Pillar Card */
const PillarCard = ({ member }) => (
    <div className="bg-white rounded-[2rem] p-8 border border-stone-100 shadow-sm hover:shadow-xl transition-all duration-500 text-center group relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-200 via-orange-400 to-orange-200 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
        <div className="relative mb-6 inline-block">
            <div className="w-28 h-28 rounded-full border-4 border-stone-50 overflow-hidden group-hover:scale-105 transition-transform duration-300 mx-auto shadow-inner">
                <div className="w-full h-full bg-stone-100 flex items-center justify-center text-stone-300">
                    <User size={48} />
                </div>
            </div>
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-stone-900 text-white px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] whitespace-nowrap shadow-xl">
                {member.role}
            </div>
        </div>
        <h3 className="text-2xl font-serif font-bold text-stone-800 mb-2 group-hover:text-orange-800 transition-colors">{member.name}</h3>
        <p className="text-stone-500 italic px-4 leading-relaxed">"{member.achievement}"</p>
    </div>
);

const Home = () => {
    // Mock Data
    const announcements = [
        { id: 1, title: '94th Annual Gathering: A Legacy Continues', date: '10 Feb', tag: 'Event' },
        { id: 2, title: 'Scholarship Applications Open for 2026', date: '15 Jan', tag: 'Education' },
        { id: 3, title: 'New Digital Archive Features Released', date: 'Now', tag: 'System' }
    ];

    const helpRequests = [
        { id: 1, title: 'Seeking 1971 Liberation War Records', date: '2h ago', tag: 'Research', type: 'alert' },
        { id: 2, title: 'Urgent: B+ Blood Donor in Dhaka', date: '5h ago', tag: 'Medical', type: 'alert' }
    ];

    const featuredMembers = [
        { id: 1, name: 'Dr. Anupam Barai', role: 'Cardiologist', achievement: 'National Healthcare Award 2025 Recipient' },
        { id: 2, name: 'Shubra Barai', role: 'Educator', achievement: 'District Best Teacher Award' }
    ];

    return (
        <div className="min-h-screen bg-[#fffcf5] text-stone-800 font-sans pb-20">
            <AnimationStyles />

            {/* HERO SECTION - 50vh Centered Design (Light Theme) */}
            <div className="relative w-full h-[50vh] min-h-[500px] mb-16 group bg-[#fffcf5]">

                {/* 1. Background Slider - Light Theme */}
                <div className="absolute inset-0 z-0 overflow-hidden opacity-30">
                    <ImageSlider className="w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-[20s]" showOverlay={false} />
                    <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-[#fffcf5]"></div>
                </div>

                {/* 2. Content Container - Centered */}
                <div className="relative z-10 w-full h-full max-w-7xl mx-auto px-4 md:px-8 flex flex-col justify-center items-center text-center">

                    <div className="space-y-4 max-w-4xl mx-auto animate-fade-up relative z-10">


                        <h1 className="text-5xl   md:text-7xl lg:text-8xl font-serif font-bold leading-none tracking-tight text-stone-900 drop-shadow-sm">
                            বাড়ৈ বংশের
                        </h1>

                        <h1 className="text-5xl p-2  md:text-7xl lg:text-8xl font-serif font-bold leading-none tracking-tight text-stone-900 drop-shadow-sm">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-700 to-red-700"> ইতিবৃত্ত</span>
                        </h1>


                        <p className="text-xl text-stone-400 font-light leading-relaxed max-w-2xl mx-auto">
                            Connecting 8+ generations. Preserving our shared history, stories, and bloodline for the future.
                        </p>

                        <div className="flex flex-wrap items-center justify-center gap-5 pt-2">
                            <Link to="/explorer" className="px-10 py-4 bg-orange-700 hover:bg-orange-800 text-white rounded-full font-bold shadow-lg shadow-orange-900/10 hover:-translate-y-1 transition-all duration-300 flex items-center gap-2 text-sm uppercase tracking-wider">
                                পরিবার খুজুন  <ArrowRight size={18} />
                            </Link>
                            <Link to="/history" className="px-10 py-4 bg-white hover:bg-orange-50 text-stone-800 border-2 border-orange-100/50 rounded-full font-bold transition-all duration-300 text-sm uppercase tracking-wider hover:border-orange-200 shadow-sm hover:shadow-md">
                                বংশের ইতিহাস
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* MAIN CONTENT CONTAINER */}
            <div className="max-w-7xl mx-auto px-6 md:px-8">

                {/* NOTICES & HELP DESK SECTION - Grid Layout Below Hero */}
                <div className="grid lg:grid-cols-2 gap-8 mb-24 mt-12 relative z-20">

                    {/* Notices Panel */}
                    <div className="glass-panel rounded-[2rem] p-8 animate-fade-up delay-100">
                        <div className="flex items-center justify-between mb-8 pb-4 border-b border-stone-200/50">
                            <h2 className="text-2xl font-serif font-bold text-stone-800 flex items-center gap-3">
                                <div className="p-2 bg-orange-100 rounded-lg text-orange-600"><Bell size={24} /></div>
                                Community Notices
                            </h2>
                            <Link to="/notices" className="text-xs font-bold uppercase tracking-widest text-stone-400 hover:text-orange-600 transition-colors bg-white px-3 py-1 rounded-full shadow-sm border border-stone-100">View All</Link>
                        </div>
                        <div className="space-y-2">
                            {announcements.map(item => (
                                <ListItem key={item.id} icon={Calendar} {...item} />
                            ))}
                        </div>
                    </div>

                    {/* Help Desk Panel */}
                    <div className="glass-panel rounded-[2rem] p-8 animate-fade-up delay-200">
                        <div className="flex items-center justify-between mb-8 pb-4 border-b border-stone-200/50">
                            <h2 className="text-2xl font-serif font-bold text-stone-800 flex items-center gap-3">
                                <div className="p-2 bg-red-100 rounded-lg text-red-600"><HelpCircle size={24} /></div>
                                Help & Support
                            </h2>
                            <Link to="/help" className="text-xs font-bold uppercase tracking-widest text-stone-400 hover:text-orange-600 transition-colors bg-white px-3 py-1 rounded-full shadow-sm border border-stone-100">View All</Link>
                        </div>
                        <div className="space-y-2">
                            {helpRequests.map(item => (
                                <ListItem key={item.id} icon={AlertCircle} type="alert" {...item} />
                            ))}
                            <button className="w-full mt-4 py-3 rounded-xl border-2 border-dashed border-stone-200 text-stone-400 font-bold hover:bg-orange-50 hover:border-orange-200 hover:text-orange-600 transition-all flex items-center justify-center gap-2 group">
                                <span className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center group-hover:bg-orange-100 text-stone-400 group-hover:text-orange-500 transition-colors">+</span>
                                Create New Request
                            </button>
                        </div>
                    </div>
                </div>

                {/* Pillars Section */}
                <section className="mb-24">
                    <div className="text-center mb-16">
                        <div className="inline-block px-4 py-1.5 rounded-full bg-stone-100 text-stone-500 text-[11px] font-bold uppercase tracking-[0.2em] mb-4 border border-stone-200">
                            Hall of Fame
                        </div>
                        <h2 className="text-4xl md:text-5xl font-serif font-bold text-stone-800 mb-4">Community Pillars</h2>
                        <p className="text-stone-500 max-w-xl mx-auto text-lg">Celebrating those who uphold our values and lead by example.</p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        {featuredMembers.map(member => (
                            <PillarCard key={member.id} member={member} />
                        ))}
                    </div>
                </section>

                {/* Simple Footer/Quote */}
                <div className="text-center max-w-3xl mx-auto pb-12 border-t border-stone-200/50 pt-16">
                    <p className="font-serif text-3xl text-stone-300 leading-tight italic">
                        "United by blood, connected by heart."
                    </p>
                </div>

            </div>
        </div>
    );
};

export default Home;

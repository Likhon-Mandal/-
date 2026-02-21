import React, { useState } from 'react';
import { ArrowRight, ArrowRightLeft, Users } from 'lucide-react';
import MemberSelector from '../components/MemberSelector';

const FindRelation = () => {
    const [personA, setPersonA] = useState(null);
    const [personB, setPersonB] = useState(null);

    // Calculate relationship based on level
    // Lower level = older generation (e.g., Level 1 is older than Level 3)
    const calculateRelationship = () => {
        if (!personA || !personB) return null;

        if (personA.id === personB.id) {
            return {
                diff: 0,
                text: "একই ব্যক্তি",
                depthStr: "0"
            };
        }

        const levelDiff = personA.level - personB.level;

        let relationString = "";
        let distance = Math.abs(levelDiff);

        if (levelDiff === 0) {
            relationString = "একই প্রজন্ম (ভাই-বোন / খুড়তুতো-জেঠতুতো-মাসতুতো)";
        } else if (levelDiff === -1) {
            relationString = "১ প্রজন্ম উপরের (বাবা-মা / কাকা-জেঠা-পিসি-মামা-মাসি)";
        } else if (levelDiff === 1) {
            relationString = "১ প্রজন্ম নিচের (ছেলে-মেয়ে / ভাইপো-ভাইঝি / ভাগ্নে-ভাগ্নি)";
        } else if (levelDiff === -2) {
            relationString = "২ প্রজন্ম উপরের (ঠাকুরদা-ঠাকুমা / দাদু-দিদা)";
        } else if (levelDiff === 2) {
            relationString = "২ প্রজন্ম নিচের (নাতি-নাতনি)";
        } else if (levelDiff < -2) {
            relationString = `${distance} প্রজন্ম উপরের (পূর্বপুরুষ স্তর)`;
        } else if (levelDiff > 2) {
            relationString = `${distance} প্রজন্ম নিচের (উত্তরাধিকারী স্তর)`;
        }

        return {
            diff: levelDiff,
            text: relationString,
            depthStr: distance === 0 ? '0' : distance.toString()
        };
    };

    const relationResult = calculateRelationship();

    return (
        <div className="space-y-8 animate-fade-in pb-12">

            {/* Header section */}
            <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-orange-100 flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-50 rounded-full blur-3xl -z-10 opacity-50 translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-50 rounded-full blur-3xl -z-10 opacity-50 -translate-x-1/2 translate-y-1/2"></div>

                <div className="relative z-10 text-center md:text-left">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 mb-4 tracking-tight drop-shadow-sm">
                        সম্পর্ক <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-700 block sm:inline">নির্ণয়</span>
                    </h1>
                    <p className="text-stone-500 max-w-lg text-lg font-light">
                        বংশগত স্তরের তুলনা করে যে কোনো দুজন পরিবারের সদস্যের মধ্যে প্রজন্মের ব্যবধান এবং সম্পর্ক জানুন।
                    </p>
                </div>

                <div className="w-24 h-24 bg-white rounded-full shadow-lg border-4 border-orange-50 flex items-center justify-center shrink-0 relative z-10 animate-pulse-slow">
                    <Users size={40} className="text-orange-500" />
                </div>
            </div>

            {/* Selection Area */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-start relative z-20">
                {/* Person A Selector */}
                <div className="md:col-span-2 bg-white p-6 rounded-2xl shadow-md border border-stone-100 hover:shadow-lg transition-shadow duration-300 relative z-30">
                    <MemberSelector
                        label="প্রথম ব্যক্তি নির্বাচন করুন"
                        onSelect={setPersonA}
                        selectedMember={personA}
                    />
                </div>

                {/* Connector Center Graphic */}
                <div className="md:col-span-1 flex items-center justify-center h-full py-8 md:py-0 relative z-10">
                    <div className="hidden md:block absolute left-0 right-0 top-1/2 h-1 bg-stone-200 -z-10 rounded-full w-full"></div>
                    <div className={`
                        w-16 h-16 rounded-full flex items-center justify-center border-4 shadow-md transition-all duration-500
                        ${(personA && personB) ? 'bg-orange-500 border-white text-white scale-110 shadow-orange-500/20' : 'bg-white border-stone-100 text-stone-300 scale-100'}
                    `}>
                        <ArrowRightLeft size={24} className={(personA && personB) ? 'animate-pulse' : ''} />
                    </div>
                </div>

                {/* Person B Selector */}
                <div className="md:col-span-2 bg-white p-6 rounded-2xl shadow-md border border-stone-100 hover:shadow-lg transition-shadow duration-300 relative z-30">
                    <MemberSelector
                        label="দ্বিতীয় ব্যক্তি নির্বাচন করুন"
                        onSelect={setPersonB}
                        selectedMember={personB}
                    />
                </div>
            </div>

            {/* Results Area */}
            {relationResult && (
                <div className="mt-8 animate-slide-up origin-top p-1">
                    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-orange-100/50">
                        <div className="bg-stone-900 px-8 py-6 text-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-orange-900/20 to-red-900/20"></div>
                            <h2 className="text-sm font-bold tracking-[0.2em] text-orange-400 uppercase relative z-10">সম্পর্কের দূরত্ব</h2>
                        </div>

                        <div className="p-8 md:p-12 text-center bg-gradient-to-b from-[#fffcf5] to-white">

                            {/* Visual Nodes Result */}
                            <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 mb-10">

                                <div className="flex flex-col items-center group">
                                    <div className="w-24 h-24 rounded-full border-4 border-orange-200 bg-white overflow-hidden shadow-lg mb-3 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                                        {personA.profile_image_url ? (
                                            <img src={personA.profile_image_url} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="font-serif text-3xl text-orange-800 font-bold">{personA.full_name.charAt(0)}</span>
                                        )}
                                    </div>
                                    <span className="font-bold text-stone-800 text-lg">{personA.full_name}</span>
                                    <span className="text-xs font-bold bg-stone-200 text-stone-600 px-2 py-0.5 rounded-full mt-1">Level {personA.level}</span>
                                </div>

                                <div className="flex flex-col items-center text-orange-500 px-4">
                                    <span className="text-5xl font-serif font-bold text-orange-600 drop-shadow-sm mb-1">{relationResult.depthStr}</span>
                                    <span className="text-xs uppercase tracking-widest font-bold text-stone-400">প্রজন্মের ব্যবধান</span>
                                </div>

                                <div className="flex flex-col items-center group">
                                    <div className="w-24 h-24 rounded-full border-4 border-red-200 bg-white overflow-hidden shadow-lg mb-3 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                                        {personB.profile_image_url ? (
                                            <img src={personB.profile_image_url} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="font-serif text-3xl text-red-800 font-bold">{personB.full_name.charAt(0)}</span>
                                        )}
                                    </div>
                                    <span className="font-bold text-stone-800 text-lg">{personB.full_name}</span>
                                    <span className="text-xs font-bold bg-stone-200 text-stone-600 px-2 py-0.5 rounded-full mt-1">Level {personB.level}</span>
                                </div>

                            </div>

                            {/* Textual Conclusion */}
                            <div className="inline-block bg-orange-50 border border-orange-200 px-8 py-4 rounded-full shadow-inner relative max-w-2xl w-full mx-auto">
                                <p className="text-xl md:text-2xl font-serif font-medium text-stone-800 leading-snug">
                                    <span className="font-bold text-orange-700">{personB.full_name}</span> -এর <span className="font-bold text-red-700 border-b-2 border-red-200">{relationResult.text}</span> হলেন <span className="font-bold text-orange-700">{personA.full_name}</span>।
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FindRelation;

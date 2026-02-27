import React, { useState, useMemo, useRef, useEffect } from 'react';
import { User, Plus, X, GraduationCap, Briefcase, MapPin, Droplet, Calendar, Phone, Mail, Award, Landmark, Edit2, Trash2, Building, Link, Facebook, Twitter, Instagram, Linkedin, Globe } from 'lucide-react';

/* ANIMATION STYLES */
const AnimationStyles = () => (
    <style>{`
        @keyframes drawVertical {
            from { height: 0; opacity: 0; }
            to { height: 100%; opacity: 1; }
        }
        @keyframes expandWidth {
            from { width: 0; opacity: 0; }
            to { width: 100%; opacity: 1; }
        }
        @keyframes unfoldNode {
            from { opacity: 0; transform: translateY(-20px) scale(0.9); }
            to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes pulseGlow {
            0% { box-shadow: 0 0 0 0 rgba(234, 88, 12, 0.4); }
            70% { box-shadow: 0 0 0 6px rgba(234, 88, 12, 0); }
            100% { box-shadow: 0 0 0 0 rgba(234, 88, 12, 0); }
        }
        @keyframes fadeInModal {
            from { opacity: 0; transform: scale(0.98) translateY(10px); }
            to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-draw-v { animation: drawVertical 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
        .animate-expand-w { animation: expandWidth 0.5s cubic-bezier(0.4, 0, 0.2, 1) 0.2s forwards; }
        .animate-unfold { animation: unfoldNode 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        .animate-modal { animation: fadeInModal 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

        /* Hide Horizontal Scrollbar but keep functionality */
        .gen-row-scroll {
            -ms-overflow-style: none;  /* IE and Edge */
            scrollbar-width: none;  /* Firefox */
        }
        .gen-row-scroll::-webkit-scrollbar {
            display: none; /* Chrome, Safari and Opera */
        }
    `}</style>
);

/* Helper Component for Modal Info Items */
const InfoItem = ({ icon, label, value, highlight }) => (
    <div className="flex items-start gap-3 p-3 rounded-2xl bg-stone-50 border border-stone-100 hover:bg-white hover:shadow-sm transition-all duration-300">
        <div className={`p-2 rounded-xl shrink-0 ${highlight ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}`}>
            {icon}
        </div>
        <div className="min-w-0 flex-1">
            <p className="text-[9px] font-bold text-stone-400 uppercase tracking-widest mb-0.5">{label}</p>
            <div className={`text-sm font-bold break-words ${highlight ? 'text-red-700' : 'text-stone-700'}`}>
                {value || 'N/A'}
            </div>
        </div>
    </div>
);

/* DETAILS MODAL COMPONENT */
const PersonDetailsModal = ({ person, onClose, onEditNode, onDeleteNode }) => {
    if (!person) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-stone-950/80 backdrop-blur-md" onClick={onClose}>
            <div
                className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-4xl overflow-hidden animate-modal flex flex-col md:flex-row h-auto max-h-[90vh]"
                onClick={e => e.stopPropagation()}
            >
                <div className="md:w-1/3 bg-gradient-to-br from-orange-700 to-orange-900 p-8 text-white flex flex-col items-center justify-center relative overflow-hidden shrink-0">
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '20px 20px' }}></div>
                    <div className="relative mb-6 flex flex-col items-center">
                        {person.eminent_category && (
                            <div className="mb-4 z-20 flex items-center gap-1.5 bg-green-100 text-green-800 border-2 border-white rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.15em] shadow-xl whitespace-nowrap">
                                <Award size={12} className="text-green-600" />
                                {person.eminent_category}
                            </div>
                        )}
                        <div className="relative">
                            <div className="w-32 h-32 rounded-full border-4 border-white/30 p-1 shadow-2xl relative z-10 mx-auto">
                                <div className="w-full h-full rounded-full overflow-hidden bg-white/20 backdrop-blur-md flex items-center justify-center">
                                    {person.profile_image_url ? (
                                        <img src={person.profile_image_url} alt={person.full_name} className="w-full h-full object-cover" />
                                    ) : (
                                        <User size={64} className="text-white/40" />
                                    )}
                                </div>
                            </div>
                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white text-orange-900 text-[10px] font-black px-3 py-1 rounded-full shadow-lg uppercase tracking-tighter z-20 whitespace-nowrap">
                                Gen {person.level}
                            </div>
                        </div>
                    </div>
                    <div className="text-center relative z-10">
                        <h2 className="text-3xl font-serif font-bold mb-2 text-white leading-tight">{person.full_name}</h2>
                        <div className="flex items-center justify-center gap-2 mb-6">
                            <div className="h-px w-6 bg-orange-300/50"></div>
                            <p className="text-[10px] uppercase tracking-[0.2em] text-orange-200">Projenitor ID: {person.id}</p>
                            <div className="h-px w-6 bg-orange-300/50"></div>
                        </div>
                    </div>
                </div>

                <div className="md:w-2/3 p-10 bg-white relative flex flex-col">
                    <button onClick={onClose} className="absolute top-6 right-6 p-2 text-stone-400 hover:text-stone-800 hover:bg-stone-100 rounded-full transition-all z-10">
                        <X size={20} />
                    </button>

                    <h4 className="text-xs font-black uppercase tracking-[0.3em] text-stone-300 mb-8 border-b border-stone-100 pb-4 mt-2">Ancestral Record Information</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 flex-grow">
                        <InfoItem icon={<Briefcase size={16} />} label="Current Occupation" value={person.occupation} />
                        <InfoItem icon={<Building size={16} />} label="Workplace" value={person.workplace} />
                        <InfoItem icon={<GraduationCap size={16} />} label="Educational background" value={person.education} />
                        <InfoItem icon={<Phone size={16} />} label="Contact Number" value={person.contact_number} />

                        {person.social_media ? (
                            <InfoItem
                                icon={
                                    person.social_media.toLowerCase().includes('facebook') ? <Facebook size={16} /> :
                                        person.social_media.toLowerCase().includes('instagram') ? <Instagram size={16} /> :
                                            person.social_media.toLowerCase().includes('twitter') || person.social_media.toLowerCase().includes('x.com') ? <Twitter size={16} /> :
                                                person.social_media.toLowerCase().includes('linkedin') ? <Linkedin size={16} /> :
                                                    <Globe size={16} />
                                }
                                label="Social Media"
                                value={<a href={person.social_media.startsWith('http') ? person.social_media : `https://${person.social_media}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 hover:underline">Visit Profile</a>}
                            />
                        ) : (
                            <InfoItem icon={<Link size={16} />} label="Social Media" value="N/A" />
                        )}

                        <InfoItem icon={<Droplet size={16} />} label="Emergency Blood Group" value={person.blood_group} highlight />
                        <InfoItem icon={<MapPin size={16} />} label="Ancestral Village" value={person.village || person.location} />
                        <InfoItem icon={<MapPin size={16} />} label="Current Location" value={person.present_address} />
                    </div>
                </div>
            </div>
        </div>
    );
};

/* TreeNode Component */
const TreeNode = ({ node, isActive, isDimmed, onClick, onAddChild, onViewDetails, onEditNode, onDeleteNode, level, index, className, isAdmin }) => {
    const nodeRef = useRef(null);
    const hasChildren = node.children && node.children.length > 0;
    const childrenCount = node.children ? node.children.length : 0;

    useEffect(() => {
        if (isActive && nodeRef.current) {
            setTimeout(() => {
                nodeRef.current.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'center' });
            }, 300);
        }
    }, [isActive]);

    const staggerStyle = {
        animationDelay: `${0.2 + (index * 0.05)}s`,
        opacity: 0
    };

    return (
        <div
            ref={nodeRef}
            className={`flex flex-col items-center relative ${level > 1 ? 'pt-12' : 'pt-2'} pb-6 animate-unfold origin-top shrink-0 ${className || ''}`}
            style={staggerStyle}
        >
            {/* Connector Line UP - Extends up to meet the horizontal bus */}
            {level > 1 && (
                <div className="absolute top-0 left-1/2 -translate-x-[1px] w-[2px] h-full bg-orange-300 origin-top z-0 max-h-12"></div>
            )}

            {/* CARD */}
            <div
                onClick={(e) => {
                    e.stopPropagation();
                    onClick();
                }}
                className={`
                    group relative z-30 flex flex-col items-center w-44 pt-4 pb-6
                    bg-white rounded-2xl cursor-pointer 
                    transition-all duration-400 ease-[cubic-bezier(0.25,0.1,0.25,1)]
                    border mb-0
                    ${isActive
                        ? 'border-orange-500 ring-4 ring-orange-500/10 shadow-xl -translate-y-2 scale-105 z-50'
                        : isDimmed
                            ? 'border-stone-200 opacity-50 scale-95 grayscale-[0.8] hover:grayscale-0 hover:opacity-100 hover:scale-100'
                            : 'border-stone-200 shadow-sm hover:border-orange-300 hover:shadow-md hover:-translate-y-1'
                    }
                `}
            >
                {/* Active Indicator Top Strip - ONLY for Level > 1 */}
                {isActive && level > 1 && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-orange-500 rounded-b-full"></div>
                )}

                {/* Edit & Delete Actions (Always Visible on Top Right) */}
                <div className="absolute top-2 right-2 flex gap-1 z-50">
                    {isAdmin && onDeleteNode && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onDeleteNode(node);
                            }}
                            className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                            title="Delete Member"
                        >
                            <Trash2 size={14} />
                        </button>
                    )}
                    {isAdmin && onEditNode && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onEditNode(node);
                            }}
                            className="p-1.5 text-stone-400 hover:text-orange-600 hover:bg-orange-50 rounded-md transition-colors"
                            title="Edit Member"
                        >
                            <Edit2 size={14} />
                        </button>
                    )}
                </div>

                {/* Profile Picture */}
                <div
                    className="relative mb-3 group/avatar"
                    onClick={(e) => {
                        e.stopPropagation();
                        if (onViewDetails) onViewDetails(node);
                    }}
                >
                    <div className={`
                        relative w-16 h-16 rounded-full p-1 transition-all duration-500
                        ${isActive ? 'bg-gradient-to-tr from-orange-500 to-yellow-500' : 'bg-stone-100 group-hover/avatar:bg-orange-200'}
                    `}>
                        <div className="w-full h-full rounded-full overflow-hidden bg-white border-2 border-white">
                            {node.profile_image_url ? (
                                <img src={node.profile_image_url} alt={node.full_name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-stone-50 text-stone-300">
                                    <User size={24} />
                                </div>
                            )}
                        </div>
                    </div>
                    <div className={`
                        absolute -bottom-2 left-1/2 -translate-x-1/2 text-[9px] font-bold px-2 py-0.5 rounded-full border shadow-sm whitespace-nowrap z-10 transition-colors
                        ${isActive ? 'bg-orange-600 text-white border-orange-500' : 'bg-white text-stone-500 border-stone-200'}
                    `}>
                        G{node.level || level}
                    </div>
                </div>

                {/* Basic Identity Info */}
                <div className="w-full flex flex-col items-center text-center px-2">
                    <h3 className={`text-sm font-serif font-bold leading-tight w-full truncate mb-1 transition-colors ${isActive ? 'text-orange-900' : 'text-stone-800'}`}>
                        {node.full_name}
                    </h3>
                    <div className="text-[10px] font-medium text-stone-400 uppercase tracking-wide">
                        {childrenCount > 0 ? `${childrenCount} Children` : 'No Children'}
                    </div>
                </div>

                {node.eminent_category && (
                    <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-yellow-50 text-yellow-700 border border-yellow-200 text-[7px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider whitespace-nowrap z-20">
                        <Award size={8} className="text-yellow-600" />
                        {node.eminent_category}
                    </div>
                )}

                {/* Centered Add Button */}
                {isAdmin && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            if (onAddChild) onAddChild(node);
                        }}
                        className={`
                        absolute -bottom-4 left-1/2 -translate-x-1/2
                        w-8 h-8 rounded-full flex items-center justify-center
                        border-2 border-white shadow-md transition-transform duration-300 hover:scale-110 active:scale-95
                        ${isActive ? 'bg-orange-600 text-white' : 'bg-stone-50 text-stone-400 hover:bg-orange-100 hover:text-orange-600'}
                    `}
                        title="Add Child"
                    >
                        <Plus size={16} strokeWidth={3} />
                    </button>
                )}
            </div>

            {/* Connector Line DOWN - Extends down to touch the horizontal bus of next layer */}
            {isActive && hasChildren && (
                <div className="absolute bottom-0 left-1/2 -translate-x-[1px] w-[2px] h-10 bg-orange-400 z-0 animate-draw-v origin-top"></div>
            )}
        </div>
    );
};

/* Main Component */
const FamilyTree = ({ members, onAddChild, onAddRoot, onEditNode, onDeleteNode, isAdmin }) => {
    const [activePathIds, setActivePathIds] = useState([]);
    const [selectedPerson, setSelectedPerson] = useState(null);

    // Transform Flat List to Hierarchy
    const roots = useMemo(() => {
        if (!members) {
            // Mock Data
            return Array.from({ length: 4 }).map((_, rootIndex) => ({
                id: `root-${rootIndex + 1}`,
                full_name: `Ancestor ${rootIndex + 1}`,
                occupation: 'Clan Head',
                education: 'Scholar',
                location: 'Barishal',
                blood_group: 'O+',
                level: 1,
                children: Array.from({ length: 11 }).map((_, childIndex) => ({
                    id: `c-${rootIndex}-${childIndex}`,
                    full_name: `Descendant ${rootIndex + 1}-${childIndex + 1}`,
                    occupation: 'Entrepreneur',
                    education: 'University Graduate',
                    location: 'Dhaka',
                    level: 2,
                    children: []
                }))
            }));
        }

        const map = {};
        const roots = [];
        members.forEach(member => { map[String(member.id)] = { ...member, children: [] }; });
        members.forEach(member => {
            const memberId = String(member.id);
            const parentId = member.father_id || member.fatherId || member.mother_id || member.motherId;
            if (parentId && map[parentId]) {
                map[parentId].children.push(map[memberId]);
            } else {
                roots.push(map[memberId]);
            }
        });

        // Now sort the constructed arrays chronologically by created_at to guarantee left-to-right order
        members.forEach(member => {
            const memberNode = map[String(member.id)];
            if (memberNode && memberNode.children.length > 0) {
                // Sort children by created_at to maintain insertion order left-to-right
                memberNode.children.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
            }
        });

        return roots.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    }, [members]);

    const handleNodeClick = (node, depth) => {
        const isSameNode = activePathIds[depth] === node.id;
        if (isSameNode) {
            setActivePathIds(activePathIds.slice(0, depth));
        } else {
            const newPath = activePathIds.slice(0, depth);
            newPath.push(node.id);
            setActivePathIds(newPath);
        }
    };

    const layers = useMemo(() => {
        const _layers = [roots];
        let currentNodes = roots;

        activePathIds.forEach((activeId) => {
            const activeNode = currentNodes?.find(n => n.id === activeId);
            if (activeNode && activeNode.children && activeNode.children.length > 0) {
                _layers.push(activeNode.children);
                currentNodes = activeNode.children;
            } else {
                currentNodes = [];
            }
        });
        return _layers;
    }, [roots, activePathIds]);

    return (
        <div className="min-h-screen bg-[#fffcf5] p-8 font-sans flex flex-col items-center overflow-x-hidden">
            <AnimationStyles />

            {/* Person Detail Modal */}
            {selectedPerson && (
                <PersonDetailsModal
                    person={selectedPerson}
                    onClose={() => setSelectedPerson(null)}
                    onEditNode={onEditNode}
                    onDeleteNode={onDeleteNode}
                />
            )}

            {/* Background Pattern */}
            <div className="fixed inset-0 opacity-[0.04] pointer-events-none"
                style={{ backgroundImage: 'linear-gradient(#9a3412 1px, transparent 1px), linear-gradient(90deg, #9a3412 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
            </div>

            {/* Header */}
            <div className="relative z-10 text-center mb-10 mt-4 animate-unfold">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100/50 border border-orange-200 text-orange-800 text-[10px] font-bold uppercase tracking-widest mb-3 backdrop-blur-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-600 animate-pulse"></span>
                    Ancestral Record System
                </div>
                <h1 className="text-4xl md:text-5xl font-serif font-bold text-stone-800 mb-2">Ancestral Lineage</h1>
                <p className="text-stone-500 text-sm max-w-md mx-auto mb-8 tracking-tight">Explore the living history across generations.</p>

                {isAdmin && (
                    <button
                        onClick={() => onAddRoot && onAddRoot()}
                        className="group relative inline-flex items-center gap-2 px-8 py-3 bg-orange-800 hover:bg-orange-700 text-white font-bold rounded-full shadow-lg transition-all active:scale-95 text-sm uppercase tracking-widest overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                        <Plus size={18} strokeWidth={3} className="relative z-10" />
                        <span className="relative z-10">Add Root Member</span>
                    </button>
                )}
            </div>

            {/* Tree Content Area */}
            <div className="w-full flex flex-col gap-0 pb-32">
                {layers.map((layerNodes, layerIndex) => {
                    const activeNodeId = activePathIds[layerIndex];
                    const hasActiveNode = !!activeNodeId;

                    return (
                        <div key={layerIndex} className="flex flex-col items-center relative w-full mb-0 overflow-visible">

                            {/* Horizontal Bus Line - Fixed 80% Width across screen */}
                            {layerIndex > 0 && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[2px] bg-orange-300 z-0 opacity-80 rounded-full animate-expand-w"></div>
                            )}

                            {/* Gen Row Container */}
                            <div className="w-full relative group p-0 overflow-visible">
                                <div className="gen-row-scroll flex flex-nowrap justify-start overflow-x-auto p-0 min-h-[160px] relative z-10 scroll-smooth px-8 sm:px-16">

                                    {/* Content Wrapper - w-fit mx-auto for centering, flex-nowrap for row */}
                                    <div className="w-fit mx-auto flex flex-nowrap gap-x-6 items-start relative pt-0">

                                        {layerNodes.map((node, index) => (
                                            <TreeNode
                                                key={node.id}
                                                node={node}
                                                index={index}
                                                isActive={activeNodeId === node.id}
                                                isDimmed={hasActiveNode && node.id !== activeNodeId}
                                                onClick={() => handleNodeClick(node, layerIndex)}
                                                onAddChild={onAddChild}
                                                onViewDetails={setSelectedPerson}
                                                onEditNode={onEditNode}
                                                onDeleteNode={onDeleteNode}
                                                level={node.level || (layerIndex + 1)}
                                                isAdmin={isAdmin}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default FamilyTree;
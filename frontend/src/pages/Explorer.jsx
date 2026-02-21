import React, { useState, useEffect } from 'react';
import { ChevronRight, Map, Home, Plus, Edit2, Check, X } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import FamilyTree from '../components/FamilyTree';
import LocationTree from '../components/LocationTree';
import MemberForm from '../components/MemberForm';
import MemberProfileModal from '../components/MemberProfileModal';

import LocationForm from '../components/LocationForm';

const Explorer = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [options, setOptions] = useState([]);
    const [hierarchyData, setHierarchyData] = useState([]);
    const [activeGraphPath, setActiveGraphPath] = useState([]);
    const [viewMode, setViewMode] = useState('graph'); // 'grid' or 'graph'
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isLocationFormOpen, setIsLocationFormOpen] = useState(false);
    const [addChildContext, setAddChildContext] = useState(null);
    const [selectedDetailMember, setSelectedDetailMember] = useState(null);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const [editingItem, setEditingItem] = useState(null);
    const [editValue, setEditValue] = useState('');

    const handleEditSubmit = async (level, oldName, newName, parentName) => {
        try {
            const response = await fetch('http://localhost:5001/api/family/location', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ level, oldName, newName, parentName })
            });
            if (!response.ok) {
                const err = await response.json();
                alert(err.error || 'Failed to update location');
                return false;
            }

            // Refresh view
            if (viewMode === 'grid') {
                const parent = pathSegments.length > 0 ? pathSegments[pathSegments.length - 1] : null;
                fetchOptions(currentLevel, parent);
            } else {
                // Rebuild the hierarchy
                buildHierarchyData();
            }
            return true;
        } catch (e) {
            console.error('Error updating:', e);
            alert('Server error updating location');
            return false;
        }
    };

    // Derive State from URL
    // Hierarchy: Country -> District -> Upazila -> Village -> Home -> Details
    const pathSegments = location.pathname.split('/').filter(p => p && p !== 'explorer').map(p => decodeURIComponent(p));

    const levelMap = ['country', 'district', 'upazila', 'village', 'home', 'details'];
    const currentLevel = levelMap[pathSegments.length] || 'country';

    const breadcrumbs = ['World', ...pathSegments];
    const selection = pathSegments.length > 0 ? pathSegments[pathSegments.length - 1] : null;

    // Geographic context for new member
    const geoContext = {
        country: pathSegments[0] || 'Bangladesh',
        district: pathSegments[1] || '',
        upazila: pathSegments[2] || '',
        // Union removed
        village: pathSegments[3] || '',
        home_name: pathSegments[4] || ''
    };

    useEffect(() => {
        // Determine what to fetch based on current level derived from URL
        if (currentLevel === 'details') {
            const homeName = pathSegments[4]; // Index shifted
            const village = pathSegments[3]; // Index shifted
            if (homeName && village) {
                fetchHouseholdMembers(homeName, village);
            }
        } else {
            const parent = pathSegments.length > 0 ? pathSegments[pathSegments.length - 1] : null;
            fetchOptions(currentLevel, parent);

            // For graphic view, we need a root-down hierarchy based on current path
            if (viewMode === 'graph') {
                buildHierarchyData();
            }
        }
    }, [location.pathname, viewMode]); // Re-run whenever URL or view changes

    const fetchOptions = async (level, parent) => {
        try {
            setLoading(true);
            let url = `http://localhost:5001/api/family/hierarchy?level=${level}`;
            if (parent && level !== 'country') {
                url += `&parent=${encodeURIComponent(parent)}`;
            }

            const response = await fetch(url);
            if (!response.ok) throw new Error('Failed to fetch data');
            const data = await response.json();
            setOptions(data);
        } catch (error) {
            console.error('Error fetching options:', error);
            setOptions([]);
        } finally {
            setLoading(false);
        }
    };

    const buildHierarchyData = async () => {
        // Build a nested structure starting from the current level's parent, Or root if at country level.
        try {
            setLoading(true);

            if (currentLevel === 'country') {
                // Fetch countries
                const res = await fetch(`http://localhost:5001/api/family/hierarchy?level=country`);
                const countries = await res.json();
                const rootData = countries.map(c => ({ name: c, level: 'country', children: [] }));
                setHierarchyData(rootData);
                setActiveGraphPath([]);
            } else {
                // We are at a deeper level. We need to construct the path down to the current options.
                // For simplicity in this demo, since we only have the 'hierarchy' endpoint that gives one level at a time,
                // we will build a structure that has the current path as a single lineage, plus the current options as the leaves.

                let rootLevelName = pathSegments[0]; // e.g. Bangladesh

                // Helper function to build nested data
                let currentData = { name: rootLevelName, level: 'country', children: [] };
                let dataRef = currentData;
                let pathArray = [{ name: rootLevelName, level: 'country' }];

                for (let i = 1; i < pathSegments.length; i++) {
                    const nodeName = pathSegments[i];
                    const levelName = levelMap[i];
                    const newNode = { name: nodeName, level: levelName, children: [] };
                    dataRef.children = [newNode];
                    dataRef = newNode;
                    pathArray.push({ name: nodeName, level: levelName });
                }

                // Now fetch the actual options for the *current* level and add them to the leaf
                const parentName = pathSegments[pathSegments.length - 1];
                const res = await fetch(`http://localhost:5001/api/family/hierarchy?level=${currentLevel}&parent=${encodeURIComponent(parentName)}`);
                const currentOptions = await res.json();

                dataRef.children = currentOptions.map(opt => ({ name: opt, level: currentLevel, children: [] }));

                setHierarchyData([currentData]);
                setActiveGraphPath(pathArray);
            }
        } catch (error) {
            console.error('Error building hierarchy data:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchHouseholdMembers = async (homeName, village) => {
        try {
            setLoading(true);
            const url = `http://localhost:5001/api/family/household?home_name=${encodeURIComponent(homeName)}&village=${encodeURIComponent(village)}`;
            const response = await fetch(url);
            if (!response.ok) throw new Error('Failed to fetch members');
            const data = await response.json();
            setMembers(data);
        } catch (error) {
            console.error('Error fetching members:', error);
            setMembers([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSelect = (item) => {
        // Navigate to deeper route
        // Current path + / + new item
        // Remove trailing slash if exists (though useLocation usually cleans it)
        const currentPath = location.pathname.endsWith('/') ? location.pathname.slice(0, -1) : location.pathname;
        navigate(`${currentPath}/${encodeURIComponent(item)}`);
    };

    const handleGraphNodeSelect = async (node, layerIndex) => {
        // Toggle logic: If the clicked node is already the active one at this layer, close it (slice the path to before this layer)
        const isAlreadyActive = activeGraphPath[layerIndex]?.name === node.name;
        if (isAlreadyActive) {
            setActiveGraphPath(activeGraphPath.slice(0, layerIndex));
            return;
        }

        // If we click a node in the graph, we fetch its children and expand it in place.
        const newPath = activeGraphPath.slice(0, layerIndex);
        newPath.push({ name: node.name, level: node.level });

        // Look up next level
        const currentLevelIndex = levelMap.indexOf(node.level);
        const nextLevel = levelMap[currentLevelIndex + 1];

        if (nextLevel && nextLevel !== 'details') {
            // Fetch children
            try {
                const res = await fetch(`http://localhost:5001/api/family/hierarchy?level=${nextLevel}&parent=${encodeURIComponent(node.name)}`);
                const childrenNames = await res.json();
                node.children = childrenNames.map(c => ({ name: c, level: nextLevel, children: [] }));

                // Trigger re-render by updating state
                setHierarchyData([...hierarchyData]);
                setActiveGraphPath(newPath);

                // Scroll container into middle of screen
                setTimeout(() => {
                    const container = document.getElementById('explorer-graph-container');
                    if (container) {
                        container.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }, 100);
            } catch (e) {
                console.error(e);
            }
        } else {
            setActiveGraphPath(newPath);
            setTimeout(() => {
                const container = document.getElementById('explorer-graph-container');
                if (container) {
                    container.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 100);
        }
    };

    const handleGraphConfirmSelection = (node) => {
        // Actually navigate to this node
        // Reconstruct path
        const pathIndex = activeGraphPath.findIndex(p => p.name === node.name);

        let base = '/explorer';
        if (pathIndex !== -1) {
            // If it's already in the active path, build url up to it
            const subPath = activeGraphPath.slice(0, pathIndex + 1).map(p => encodeURIComponent(p.name)).join('/');
            navigate(`${base}/${subPath}`);
        } else {
            // If it's a leaf node just selected
            const subPath = [...activeGraphPath.map(p => encodeURIComponent(p.name)), encodeURIComponent(node.name)].join('/');
            navigate(`${base}/${subPath}`);
        }
    };

    const resetToLevel = (index) => {
        // Navigate to a higher level based on breadcrumb index.
        // Index 0 = 'Bangladesh' -> /explorer
        // Index 1 = Division -> /explorer/Division
        if (index === 0) {
            navigate('/explorer');
        } else {
            // We need the segments corresponding to this index.
            // breadcrumbs has 'Bangladesh' at 0, so pathSegments start at index 1 of breadcrumbs.
            const targetSegments = pathSegments.slice(0, index);
            const newPath = '/explorer/' + targetSegments.map(s => encodeURIComponent(s)).join('/');
            navigate(newPath);
        }
    };

    const handleAddClick = () => {
        if (currentLevel === 'details') {
            setIsFormOpen(true);
        } else {
            setIsLocationFormOpen(true);
        }
    };

    // Callback for when a location (Country, Div, etc.) is added
    const handleLocationAdded = () => {
        const parent = pathSegments.length > 0 ? pathSegments[pathSegments.length - 1] : null;
        fetchOptions(currentLevel, parent);
    };

    // Callback for when a Member is added
    const handleMemberAdded = () => {
        if (currentLevel === 'details') {
            fetchHouseholdMembers(geoContext.home_name, geoContext.village);
        }
    };

    // Helper to get readable level name
    const getNextLevelName = () => {
        if (currentLevel === 'country') return 'Country';
        if (currentLevel === 'district') return 'District';
        if (currentLevel === 'upazila') return 'Upazila';
        // Union removed
        if (currentLevel === 'village') return 'Village';
        if (currentLevel === 'home') return 'Home';
        return 'Member';
    };

    return (
        <div className="space-y-6 animate-fade-in relative">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-orange-100 animate-slide-up flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-primary mb-2">Geographic Lineage Explorer</h1>
                    <p className="text-stone-500">Trace your roots by navigating through the geographical hierarchy.</p>
                </div>

                <div className="flex items-center gap-4">
                    {currentLevel !== 'details' && (
                        <div className="flex bg-stone-100 p-1 rounded-lg border border-stone-200">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-primary' : 'text-stone-500 hover:text-stone-700'}`}
                            >
                                Grid View
                            </button>
                            <button
                                onClick={() => setViewMode('graph')}
                                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${viewMode === 'graph' ? 'bg-white shadow-sm text-primary' : 'text-stone-500 hover:text-stone-700'}`}
                            >
                                Graph View
                            </button>
                        </div>
                    )}

                    {/* Dynamic Add Button */}
                    <button
                        onClick={handleAddClick}
                        className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition shadow-sm"
                    >
                        <Plus size={20} /> Add {getNextLevelName()}
                    </button>
                </div>
            </div>

            {/* Breadcrumbs */}
            <div className="flex flex-wrap items-center gap-2 text-sm animate-slide-up" style={{ animationDelay: '0.1s' }}>
                {breadcrumbs.map((item, index) => (
                    <React.Fragment key={index}>
                        <button
                            onClick={() => resetToLevel(index)}
                            className={`hover:text-primary font-medium transition-colors duration-200 ${index === breadcrumbs.length - 1 ? 'text-primary font-bold' : 'text-stone-500'}`}
                        >
                            {item}
                        </button>
                        {index < breadcrumbs.length - 1 && <ChevronRight className="h-4 w-4 text-stone-400" />}
                    </React.Fragment>
                ))}
            </div>

            {/* Content Area */}
            <div className="min-h-[200px]">
                {loading ? (
                    <div className="flex justify-center items-center h-full py-10 animate-pulse text-stone-400">
                        Loading data...
                    </div>
                ) : currentLevel !== 'details' ? (
                    /* Options Grid */
                    viewMode === 'grid' ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                            {options.length > 0 ? (
                                options.map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="bg-white p-6 rounded-lg shadow-sm border border-orange-100 hover:shadow-md hover:border-accent hover:-translate-y-1 transition duration-300 flex flex-col items-center justify-center text-center space-y-3 group relative"
                                        style={{ animationDelay: `${0.05 * idx}s` }}
                                    >
                                        {editingItem === item ? (
                                            <div className="w-full flex items-center justify-center gap-2" onClick={(e) => e.stopPropagation()}>
                                                <input
                                                    autoFocus
                                                    type="text"
                                                    value={editValue}
                                                    onChange={(e) => setEditValue(e.target.value)}
                                                    onKeyDown={async (e) => {
                                                        if (e.key === 'Enter') {
                                                            const parent = pathSegments.length > 0 ? pathSegments[pathSegments.length - 1] : null;
                                                            const success = await handleEditSubmit(currentLevel, item, editValue, parent);
                                                            if (success) setEditingItem(null);
                                                        }
                                                    }}
                                                    className="w-full border border-orange-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                                                />
                                                <button onClick={async (e) => {
                                                    e.stopPropagation();
                                                    const parent = pathSegments.length > 0 ? pathSegments[pathSegments.length - 1] : null;
                                                    const success = await handleEditSubmit(currentLevel, item, editValue, parent);
                                                    if (success) setEditingItem(null);
                                                }} className="p-1 text-green-600 hover:bg-green-50 rounded">
                                                    <Check size={16} />
                                                </button>
                                                <button onClick={(e) => { e.stopPropagation(); setEditingItem(null); }} className="p-1 text-red-600 hover:bg-red-50 rounded">
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                {/* Edit Button */}
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setEditingItem(item);
                                                        setEditValue(item);
                                                    }}
                                                    className="absolute top-2 right-2 p-1.5 text-stone-400 hover:text-orange-600 hover:bg-orange-50 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <Edit2 size={16} />
                                                </button>

                                                <div onClick={() => handleSelect(item)} className="cursor-pointer flex flex-col items-center w-full">
                                                    {currentLevel === 'home' ? (
                                                        <Home className="h-8 w-8 text-secondary group-hover:scale-110 transition-transform duration-300 mb-3" />
                                                    ) : (
                                                        <Map className="h-8 w-8 text-accent group-hover:scale-110 transition-transform duration-300 mb-3" />
                                                    )}
                                                    <span className="font-serif font-medium text-lg text-stone-800 group-hover:text-primary transition-colors hover:underline underline-offset-4">{item}</span>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full text-center py-10 text-stone-400 bg-white rounded-lg border border-dashed border-stone-200">
                                    No data available for this region.
                                </div>
                            )}
                        </div>
                    ) : (
                        /* Graph View */
                        <div id="explorer-graph-container" className="bg-[#fffcf5] border border-orange-100 rounded-2xl shadow-inner min-h-[500px] overflow-hidden animate-slide-up relative">
                            {/* Background Pattern */}
                            <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
                                style={{ backgroundImage: 'linear-gradient(#9a3412 1px, transparent 1px), linear-gradient(90deg, #9a3412 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
                            </div>

                            <LocationTree
                                hierarchyData={hierarchyData}
                                activePath={activeGraphPath}
                                onNodeSelect={handleGraphNodeSelect}
                                onConfirmSelection={handleGraphConfirmSelection}
                                onEditSubmit={handleEditSubmit}
                            />
                        </div>
                    )
                ) : (
                    /* Household Members View - Family Tree Only */
                    <div className="space-y-6 animate-slide-up">
                        <div className="bg-white p-8 rounded-lg shadow-md border-t-4 border-secondary text-center flex flex-col items-center">
                            <Home className="h-16 w-16 text-primary mx-auto mb-4" />
                            <h2 className="text-2xl font-serif font-bold mb-2">{selection}</h2>
                            <p className="text-stone-600 mb-6">Family Members in this Household</p>
                        </div>

                        <div className="animate-fade-in overflow-x-auto pb-4">
                            <FamilyTree
                                members={members}
                                onAddChild={(parent) => {
                                    setAddChildContext({
                                        father_id: parent.id,
                                        level: (parent.level || 0) + 1,
                                        isRoot: false // Explicitly not root
                                    });
                                    setIsFormOpen(true);
                                }}
                                onViewDetails={(member) => {
                                    setSelectedDetailMember(member);
                                    setIsProfileOpen(true);
                                }}
                                onAddRoot={() => {
                                    setAddChildContext({
                                        level: 1,
                                        isRoot: true
                                    });
                                    setIsFormOpen(true);
                                }}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Member Form Modal */}
            {/* We need a state to hold specific parent info if 'Add Child' was clicked */}
            <MemberForm
                isOpen={isFormOpen}
                onClose={() => {
                    setIsFormOpen(false);
                    setAddChildContext(null); // Reset context on close
                }}
                initialData={addChildContext ? { ...geoContext, ...addChildContext } : geoContext}
                onSuccess={handleMemberAdded}
            />

            <MemberProfileModal
                isOpen={isProfileOpen}
                member={selectedDetailMember}
                onClose={() => {
                    setIsProfileOpen(false);
                    setSelectedDetailMember(null);
                }}
                onEdit={(member) => {
                    // Close profile, open form with member data for editing
                    setAddChildContext({ ...member, isRoot: !member.father_id && !member.mother_id });
                    setIsFormOpen(true);
                }}
            />

            <LocationForm
                isOpen={isLocationFormOpen}
                onClose={() => setIsLocationFormOpen(false)}
                level={currentLevel}
                parentName={pathSegments.length > 0 ? pathSegments[pathSegments.length - 1] : null}
                onSuccess={handleLocationAdded}
            />

        </div>
    );
};

export default Explorer;

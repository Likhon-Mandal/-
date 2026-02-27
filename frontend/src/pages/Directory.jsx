import MemberCard from '../components/MemberCard';
import Profile from './Profile';
import api from '../api/api';

const Directory = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMemberId, setSelectedMemberId] = useState(null);

  // Real-time text input state (used for typing)
  const [textInputs, setTextInputs] = useState({
    name: '',
    workplace: '',
    education: ''
  });
  // Submitted filter state (used for API calls)
  const [filters, setFilters] = useState({
    name: '',
    workplace: '',
    education: '',
    blood_group: '',
    country: '',
    division: '',
    district: '',
  });
  // Debounce effect for Text Inputs to prevent spamming the backend
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters(prev => ({
        ...prev,
        name: textInputs.name,
        workplace: textInputs.workplace,
        education: textInputs.education
      }));
    }, 400); // 400ms delay after typing stops
    return () => clearTimeout(timer);
  }, [textInputs]);
  // Main Fetch Effect triggered whenever `filters` change
  useEffect(() => {
    fetchMembers();
  }, [filters]);
  const fetchMembers = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.name) params.name = filters.name;
      if (filters.workplace) params.workplace = filters.workplace;
      if (filters.education) params.education = filters.education;
      if (filters.blood_group) params.blood_group = filters.blood_group;
      if (filters.country) params.country = filters.country;
      if (filters.division) params.division = filters.division;
      if (filters.district) params.district = filters.district;

      const response = await api.get('/members', { params });
      setMembers(response.data);
    } catch (error) {
      console.error(error);
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };
  // Handler for text inputs (Name, Workplace, Education)
  const handleTextChange = (e) => {
    setTextInputs({ ...textInputs, [e.target.name]: e.target.value });
  };
  // Handler for select dropdowns (updates filters directly without debouncing)
  const handleSelectChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };
  return (
    <>
      {selectedMemberId && <Profile memberId={selectedMemberId} onClose={() => setSelectedMemberId(null)} />}

      <div className="flex flex-col md:flex-row gap-6 animate-fade-in relative z-10 w-full h-full max-w-7xl mx-auto pt-8">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-80 bg-white p-6 rounded-2xl shadow-md border border-orange-100 h-fit sticky top-24">
          <div className="flex items-center mb-6 pb-4 border-b border-orange-100/50">
            <Filter className="h-5 w-5 mr-3 text-orange-600" />
            <h2 className="text-xl font-serif font-bold text-stone-900">অনুসন্ধান ফিল্টার</h2>
          </div>
          <div className="space-y-5">
            {/* Name Input */}
            <div className="relative">
              <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-1">নাম</label>
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  value={textInputs.name}
                  onChange={handleTextChange}
                  className="w-full border-2 border-stone-200 rounded-lg pl-10 pr-3 py-2 text-stone-800 focus:outline-none focus:border-orange-500 transition-colors"
                  placeholder="নাম লিখুন..."
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
              </div>
            </div>
            {/* Workplace Input */}
            <div className="relative">
              <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-1">পেশা / কর্মক্ষেত্র</label>
              <input
                type="text"
                name="workplace"
                value={textInputs.workplace}
                onChange={handleTextChange}
                className="w-full border-2 border-stone-200 rounded-lg px-3 py-2 text-stone-800 focus:outline-none focus:border-orange-500 transition-colors"
                placeholder="পেশা লিখুন..."
              />
            </div>
            {/* Education Input */}
            <div className="relative">
              <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-1">শিক্ষাগত যোগ্যতা</label>
              <input
                type="text"
                name="education"
                value={textInputs.education}
                onChange={handleTextChange}
                className="w-full border-2 border-stone-200 rounded-lg px-3 py-2 text-stone-800 focus:outline-none focus:border-orange-500 transition-colors"
                placeholder="শিক্ষা লিখুন..."
              />
            </div>
            {/* Divider */}
            <div className="h-px bg-stone-100 w-full my-2"></div>
            {/* Blood Group Select */}
            <div>
              <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-1">রক্তের গ্রুপ</label>
              <select
                name="blood_group"
                value={filters.blood_group}
                onChange={handleSelectChange}
                className="w-full border-2 border-stone-200 rounded-lg px-3 py-2 text-stone-800 focus:outline-none focus:border-orange-500 transition-colors cursor-pointer"
              >
                <option value="">সকল গ্রুপ</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>
          </div>
        </aside>

        {/* Results Section */}
        <div className="flex-1 min-h-[500px] flex flex-col">
          {/* Results Header */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-serif font-bold text-stone-900 mb-1">পরিবার ডিরেক্টরি</h1>
              {loading ? (
                <p className="text-orange-500 text-sm font-bold animate-pulse">খোঁজ করা হচ্ছে...</p>
              ) : (
                <p className="text-stone-500 text-sm">{members.length} জন সদস্য পাওয়া গেছে</p>
              )}
            </div>
            <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center text-orange-600 border border-orange-100">
              <Users size={24} />
            </div>
          </div>

          {/* Dynamic Grid */}
          <div className="flex-1 relative">
            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm z-50 rounded-2xl border border-stone-100">
                <div className="flex items-center gap-3 px-6 py-3 bg-white rounded-full shadow-lg border border-orange-100">
                  <span className="w-4 h-4 rounded-full bg-orange-500 animate-ping"></span>
                  <span className="font-bold text-stone-600">খোঁজ করা হচ্ছে...</span>
                </div>
              </div>
            ) : null}
            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5 transition-opacity duration-300 ${loading ? 'opacity-50' : 'opacity-100'}`}>
              {members.length > 0 ? (
                members.map((member, index) => (
                  <div key={member.id} className="animate-slide-up" style={{ animationDelay: `${0.03 * index}s` }}>
                    <MemberCard
                      member={member}
                      onViewProfile={() => setSelectedMemberId(member.id)}
                    />
                  </div>
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-20 text-stone-400 bg-white rounded-2xl shadow-sm border border-dashed border-stone-200">
                  <Search size={48} className="mb-4 text-stone-300 opacity-50" />
                  <h3 className="text-xl font-serif font-bold text-stone-700 mb-2">কোনো ফলাফল পাওয়া যায়নি</h3>
                  <p className="text-stone-500 max-w-md text-center">আপনার ফিল্টার মানদণ্ডের সাথে মিলে এমন কাউন্কে পাওয়া যায়নি। অনুগ্রহ করে ফিল্টারগুলো পরিবর্তন করে আবার অনুসন্ধান করুন।</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Directory;

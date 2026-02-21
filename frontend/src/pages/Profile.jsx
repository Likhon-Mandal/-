import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { User, MapPin, Calendar, Briefcase, GraduationCap, Phone, Droplet } from 'lucide-react';

const Profile = () => {
  const { id } = useParams();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMemberDetails();
  }, [id]);

  const fetchMemberDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5001/api/members/${id}`);
      if (!response.ok) throw new Error('Member not found');
      const data = await response.json();
      setMember(data);
    } catch (error) {
      console.error(error);
      // Mock data
      setMember({
        id: id,
        full_name: 'Amit Barai',
        occupation: 'Software Engineer',
        education: 'B.Sc in CSE, KUET',
        date_of_birth: '1995-10-15',
        blood_group: 'B+',
        contact_number: '+8801700000000',
        present_address: 'Dhaka, Bangladesh',
        permanent_address: 'Madaripur, Bangladesh',
        district: 'Madaripur',
        upazila: 'Kalkini',
        village: 'Enayetnagar',
        father_name: 'Father Name', // Placeholder
        mother_name: 'Mother Name', // Placeholder
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-20">Loading profile...</div>;
  if (!member) return <div className="text-center py-20 text-red-500">Member not found.</div>;

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden border border-orange-100 animate-fade-in animate-slide-up">
      {/* Header / Cover */}
      <div className="h-32 bg-primary"></div>
      
      <div className="px-8 pb-8">
        <div className="relative flex justify-between items-end -mt-12 mb-6">
          <div className="h-24 w-24 bg-white rounded-full p-1 shadow-lg">
             <div className="h-full w-full bg-orange-100 rounded-full flex items-center justify-center text-secondary overflow-hidden">
                {member.profile_image_url ? (
                    <img src={member.profile_image_url} alt={member.full_name} className="h-full w-full object-cover" />
                ) : (
                    <User className="h-12 w-12" />
                )}
             </div>
          </div>
          <div className="flex space-x-2">
             <button className="bg-secondary text-white px-4 py-2 rounded shadow hover:bg-red-900 transition text-sm transform hover:scale-105 active:scale-95 duration-200">
                Connect
             </button>
             <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded shadow hover:bg-gray-50 transition text-sm transform hover:scale-105 active:scale-95 duration-200">
                View Tree
             </button>
          </div>
        </div>

        <h1 className="text-3xl font-serif font-bold text-stone-800 mb-1">{member.full_name}</h1>
        <div className="flex items-center text-stone-500 mb-6">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{member.village}, {member.upazila}, {member.district}</span>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
                <h2 className="text-xl font-serif font-bold text-primary border-b border-orange-100 pb-2">Personal Info</h2>
                
                <div className="flex items-start group hover:bg-orange-50 p-2 rounded transition-colors">
                    <Briefcase className="h-5 w-5 text-secondary mr-3 mt-0.5 group-hover:scale-110 transition-transform" />
                    <div>
                        <span className="block text-sm text-stone-500">Occupation</span>
                        <span className="font-medium">{member.occupation || 'N/A'}</span>
                    </div>
                </div>

                <div className="flex items-start group hover:bg-orange-50 p-2 rounded transition-colors">
                    <GraduationCap className="h-5 w-5 text-secondary mr-3 mt-0.5 group-hover:scale-110 transition-transform" />
                    <div>
                        <span className="block text-sm text-stone-500">Education</span>
                        <span className="font-medium">{member.education || 'N/A'}</span>
                    </div>
                </div>

                <div className="flex items-start group hover:bg-orange-50 p-2 rounded transition-colors">
                    <Droplet className="h-5 w-5 text-secondary mr-3 mt-0.5 group-hover:scale-110 transition-transform" />
                    <div>
                        <span className="block text-sm text-stone-500">Blood Group</span>
                        <span className="font-medium">{member.blood_group || 'N/A'}</span>
                    </div>
                </div>

                 <div className="flex items-start group hover:bg-orange-50 p-2 rounded transition-colors">
                    <Calendar className="h-5 w-5 text-secondary mr-3 mt-0.5 group-hover:scale-110 transition-transform" />
                    <div>
                        <span className="block text-sm text-stone-500">Birth Date</span>
                        <span className="font-medium">{member.birth_date ? new Date(member.birth_date).toLocaleDateString() : 'N/A'}</span>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <h2 className="text-xl font-serif font-bold text-primary border-b border-orange-100 pb-2">Contact & Family</h2>
                
                <div className="flex items-start group hover:bg-orange-50 p-2 rounded transition-colors">
                    <Phone className="h-5 w-5 text-secondary mr-3 mt-0.5 group-hover:scale-110 transition-transform" />
                    <div>
                        <span className="block text-sm text-stone-500">Phone</span>
                        <span className="font-medium">{member.contact_number || 'N/A'}</span>
                    </div>
                </div>

                <div className="flex items-start group hover:bg-orange-50 p-2 rounded transition-colors">
                    <MapPin className="h-5 w-5 text-secondary mr-3 mt-0.5 group-hover:scale-110 transition-transform" />
                    <div>
                        <span className="block text-sm text-stone-500">Present Address</span>
                        <span className="font-medium">{member.present_address || 'N/A'}</span>
                    </div>
                </div>
                
                 <div className="flex items-start group hover:bg-orange-50 p-2 rounded transition-colors">
                    <User className="h-5 w-5 text-secondary mr-3 mt-0.5 group-hover:scale-110 transition-transform" />
                    <div>
                        <span className="block text-sm text-stone-500">Father</span>
                        {/* Placeholder for link */}
                        <span className="font-medium hover:text-primary cursor-pointer transition-colors">{member.father_name || 'Unknown'}</span>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

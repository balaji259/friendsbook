// MembersTab.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {useParams} from "react-router-dom";

const Members = ({ communityId }) => {
  const { id } = useParams(); // Get groupId from URL
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/community/${id}/members`);
      if (Array.isArray(response.data)) {
        setMembers(response.data);
      }
    } catch (error) {
      console.error("Error fetching members:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [communityId]);

  return (
    <div className="p-4">
      {loading ? (
        <p>Loading members...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {members.map((member) => (
            <div key={member._id} className="flex items-center p-4 border rounded-lg shadow-sm bg-white">
              <img
                src={member.profilePic || 'https://via.placeholder.com/50?text=👤'}
                alt={member.name}
                className="w-12 h-12 rounded-full mr-4 bg-gray-200 object-cover"
              />
              <div>
                <h3 className="font-semibold text-[#3b5998]">{member.fullname}</h3>
                {/* <p className="text-gray-700 text-sm">{member.year} • {member.department}</p> */}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Members;

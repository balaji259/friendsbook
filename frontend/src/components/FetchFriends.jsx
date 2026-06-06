import React, { useState, useEffect, useContext } from 'react';
import {useNavigate} from "react-router-dom";
import api from '../api/api';
import {useSocket} from "./useSocket";
import { useChatStore } from "./useChatStore";
import { AuthContext } from "./AuthContext";

const FriendsList = () => {
  const [friends, setFriends] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { users, selectedUser, setSelectedUser, chatUserId, setChatUserId, profileId, setProfileId } = useChatStore();
  const navigate=useNavigate();
  const {onlineUsers} =useSocket();
  const { authuser } = useContext(AuthContext);
  const userId = authuser?.userId;

  useEffect(() => {
    if (!userId) return; // Avoid API call until userId is available

   


    const fetchFriends = async () => {
      try {
        console.log("Fetching friends for userId:", userId);
        const response = await api.get(`/user/${userId}/friends`);
        
        setFriends(response.data.friends || []);
      
      } catch (error) {
        console.error("Error fetching friends:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFriends();
  }, [userId]);
  
  


  const goToUserProfile = (id) => {
     
    setProfileId(id);
  };

  useEffect(()=>{
    console.log("navigating to user profile");
    console.log("now the profileId is:",profileId);
    if(profileId!=null)
      navigate(`/other`);
  },[profileId]);
     

  
  const handleChat = (friendId) => {
    // navigate(`/chats?chatUserId=${friendId}`);
     // Pass the friendId as a query parameter
      setChatUserId(friendId);
      navigate('/chats');
    };


  if (isLoading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (friends.length === 0) {
    return (
      <div className="w-full max-w-4xl lg:max-w-6xl xl:max-w-7xl mx-auto p-4 sm:p-8 bg-[#d5d5d5] min-h-screen flex flex-col">
        {/* Back Button */}
        <div className="mb-4 sm:mb-6 self-start">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-50 transition duration-200 text-gray-700 font-semibold"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back
          </button>
        </div>

        <div className="flex-1 flex justify-center items-center p-8">
          <p className="text-gray-500 text-lg">No friends yet. Start following people!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl lg:max-w-6xl xl:max-w-7xl mx-auto p-4 sm:p-8 bg-[#d5d5d5] min-h-screen">
      {/* Back Button */}
      <div className="mb-4 sm:mb-6">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-50 transition duration-200 text-gray-700 font-semibold"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {friends.map((friend) => (
          <div
          key={friend._id}
            className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1 text-center"
            
          >
            {/* Profile Picture */}
            {/* <img
              src={
                friend.profilePic === "/images/default_profile.jpeg"
                  ? "/images/default_profile.jpeg"
                  : `${friend.profilePic}`

                }
                onClick={()=>{goToUserProfile(friend._id)}}
              alt={friend.username}
              className="w-full h-48 object-cover rounded-md cursor-pointer"
            /> */}

<div className="relative mx-auto lg:mx-0">
  {/* Online indicator */}
  {onlineUsers && Array.isArray(onlineUsers) && onlineUsers.includes(friend._id) && (
    <div className="absolute top-0 left-0 flex items-center gap-1 bg-black bg-opacity-70 px-2 py-1 rounded-br-md">
      <span className="w-3 h-3 bg-green-500 rounded-full" />
      <span className="text-white text-sm">Online</span>
    </div>
  )}

  <img
    src={
      friend.profilePic === "/images/squarepfp.png"
        ? "/images/squarepfp.png"
        : `${friend.profilePic}`
    }
    alt={friend.username}
    className="cursor-pointer w-full h-48 object-cover rounded-md"
    onClick={() => {
      goToUserProfile(friend._id);
    }}
  />
</div>

            {/* Username */}
            <h3 className="mt-4 text-lg font-semibold text-gray-800">{friend.username}</h3>
            <p className="mt-2 text-gray-600 text-sm">
        {friend.bio ? friend.bio : "No Bio"}
      </p>


            {/* Chat Button */}
            <div className="mt-4">
              <button
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md shadow-md transition duration-200"
                onClick={() => handleChat(friend._id)}
              >
                Chat
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FriendsList;

import React, { useState, useEffect } from 'react';
import {useNavigate} from "react-router-dom";
import axios from 'axios';
import {useSocket} from "./useSocket";
import { useChatStore } from "./useChatStore";
const FriendsList = () => {
  const [friends, setFriends] = useState([]);
  const [userId, setUserId] = useState(null); // Initialize with `null` to avoid premature API calls
  const { users, selectedUser, setSelectedUser, chatUserId, setChatUserId, profileId, setProfileId } = useChatStore();
  const backendBaseUrl = "http://localhost:7000";
  const renderurl="https://socialmedia-backend-2njs.onrender.com";
  const navigate=useNavigate();
  const {onlineUsers} =useSocket();
  const getUserIdFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;


    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      console.log("Payload:", payload.userId);
      setUserId(payload.userId); // Set the userId
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  };
  
  useEffect(() => {
    getUserIdFromToken(); // Fetch userId from token
  }, []); // Run only on component mount
  
  useEffect(() => {
    if (!userId) return; // Avoid API call until userId is available

   


    const fetchFriends = async () => {
      try {
        console.log("Fetching friends for userId:", userId);
        const response = await axios.get(`/user/${userId}/friends`);
        
        setFriends(response.data.friends);
      
      } catch (error) {
        console.error("Error fetching friends:", error);
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


  return (
    <div className="w-full max-w-4xl lg:max-w-6xl xl:max-w-7xl mx-auto p-4 sm:p-8 bg-[#d5d5d5] min-h-screen">
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

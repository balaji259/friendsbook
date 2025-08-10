import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSocket } from "./useSocket";
import { useChatStore } from "./useChatStore";
// import {useChatStore} from "./useChatStore";

const SearchSuggestions = () => {
  const [query, setQuery] = useState("");
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const backendBaseUrl = "http://localhost:7000";
  const renderurl="https://socialmedia-backend-2njs.onrender.com";
  const navigate = useNavigate();
  const { setChatUserId, profileId, setProfileId } = useChatStore();
  
  const {onlineUsers} =useSocket();

  const getUserIdFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.userId;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };

  const currentUserId = getUserIdFromToken();

  const fetchUsers = useCallback(async () => {
    if (loading) return;
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`/user/search/suggestions`, {
        params: { query },
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuggestedUsers(response.data.users);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
    setLoading(false);
  }, [query]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchUsers();
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [query]);

  const handleFollowUnfollow = async (userId, action) => {
    try {
      console.log(currentUserId,userId);
      const token = localStorage.getItem("token");
      await axios.post(`/user/search/${action}`,
        { userId: currentUserId, targetId: userId },
        { headers: { Authorization: `Bearer ${token} `} }
      );

      setSuggestedUsers((prev) =>
        prev.map((user) =>
          user._id === userId
            ? { ...user, followStatus: action === "follow" ? "unfollow" : "follow" }
            : user
        )
      );

      // ✅ Send notification **ONLY** for "follow" action
      // console.log("outside if in notifictaions");
      // if (action === "follow") {
      //      console.log("inside if in notifictaions");
      //      console.log("calling axios");
           
      //     await axios.post("/send-notification", {
      //         userId, 
      //         senderId: currentUserId,
      //         type: "Follow Notification",
      //         title: "New Follower",
      //         body: `${currentUserId} started following you!!`,
      //     }, { headers: { Authorization: `Bearer ${token}` } });

      //     console.log("Follow notification sent successfully!");
      // }

    } catch (error) {
      console.error(`Error performing ${action} action:`  , error);
    }
  };

  

  const goToUserProfile = (id) => {
    console.log(id);
    setProfileId(id);
    
  };

  useEffect(()=>{
    console.log("navigating to user profile");
    console.log("now the profileId is:",profileId);
    if(profileId!=null)
      navigate(profileId === currentUserId ? `/profile` : `/other`);

  },[profileId]);

  const handleChat = (friendId) => {
    setChatUserId(friendId);
    navigate("/chats");
  };


  return (
    <div className="w-full max-w-4xl lg:max-w-6xl xl:max-w-7xl mx-auto p-4 sm:p-8 bg-[#d5d5d5] min-h-screen">
      <div className="relative mb-8">
        <input
          type="text"
          placeholder="Search for users ...."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full p-4 rounded-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 transition duration-200 ease-in-out shadow-sm text-sm sm:text-base"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {suggestedUsers.map((user) => (
          <div
            key={user._id}
            className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1 text-center"
          >
            <div className="relative mx-auto lg:mx-0">
              {onlineUsers?.includes(user._id) && (
                <div className="absolute top-0 left-0 flex items-center gap-1 bg-black bg-opacity-70 px-2 py-1 rounded-br-md">
                  <span className="w-3 h-3 bg-green-500 rounded-full" />
                  <span className="text-white text-sm">Online</span>
                </div>
              )}
              <img
                src={
                  user.profilePic === "/images/squarepfp.png"
                    ? "/images/squarepfp.png"
                    : user.profilePic
                }
                alt={user.username}
                className="cursor-pointer w-full h-48 object-cover rounded-md"
                onClick={() => goToUserProfile(user._id)}
              />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-800">{user.username}</h3>
            <p className="mt-2 text-gray-600 text-sm">{user.bio || "No Bio"}</p>
            <div className="flex justify-between items-center mt-4 gap-4">
              <button
                onClick={() => handleFollowUnfollow(user._id, user.followStatus === "follow" ? "follow" : "unfollow")}
                className={`flex-1 px-4 py-2 ${
                  user.followStatus === "follow" ? "bg-[#3b5998] hover:bg-blue-700" : "bg-red-500 hover:bg-red-600"
                } text-white font-semibold rounded-md shadow-md transition duration-200`}
              >
                {user.followStatus === "follow" ? "Follow" : "Unfollow"}
              </button>
              <button
                className="flex-1 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-md shadow-md transition duration-200"
                onClick={() => handleChat(user._id)}
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

export default SearchSuggestions;

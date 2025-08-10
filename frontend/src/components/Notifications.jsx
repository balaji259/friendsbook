import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import {useNavigate} from 'react-router-dom';


const Notifications = () => {
  const [notifications, setNotifications] = useState([]);


  const navigate=useNavigate();
  // console.log("Navigate function:", navigate);



  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log("decoded", decoded);
        const userId = decoded.userId;
  
        fetchNotifications(userId); // Initial fetch
        const interval = setInterval(() => fetchNotifications(userId), 5000); // Polling
  
        return () => clearInterval(interval); // ✅ Cleanup function always runs
      } 
      catch (err) {
        console.log("Invalid token", err);
        navigate('/login'); 
      }
    }
  
    return () => {}; // ✅ Always return a function, even if token is missing or invalid
  }, []);

  
  const fetchNotifications = async (userId) => {
    try {
      const res = await axios.get(`/notifications/getall/${userId}`);
      console.log("Notifications API Response:", res.data);

      // setNotifications(res.data);
          // ✅ Ensure data is always an array
    setNotifications(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error('Error fetching notifications', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/notifications/delete/${id}`);
      
      // ✅ Instantly remove the notification from the UI without refreshing
      setNotifications(notifications.filter(notification => notification._id !== id));
   

    } catch (error) {
      console.error('Error deleting notification', error);
    }
  };

  

  return (
    <div className="bg-[#E9EBEE] min-h-screen">
      {/* Navigation Bar */}
      <div className="bg-[#3B5998] text-white p-4 flex items-center justify-between shadow-md">
        <div className="text-xl font-bold">friendsbook</div>
        <div className="flex space-x-4">
          <p onClick={()=>{navigate('/profile')}} className="text-sm">Profile</p>
          <p onClick={()=>{navigate('/friends')}} className="text-sm">Find Friends</p>
          {/* <p  className="text-sm">Account</p> */}
        </div>
      </div>

      {/* Notifications Section */}
      <div className="flex justify-center p-4">
        <div className="max-w-[600px] w-full bg-white shadow-md rounded-md">
          <h2 className="text-lg font-semibold p-4 border-b bg-[#F5F6F7]">Notifications</h2>
          {notifications.map((notification) => (
            <div
              key={notification._id}
              className="relative p-4 border-b hover:bg-gray-100 transition-all rounded-md"
            >
              <button
                onClick={() => handleDelete(notification._id)}
                className="absolute top-2 right-2 bg-red-500 text-white w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold shadow-lg hover:bg-red-600 transform hover:scale-105 transition-all duration-200 ease-in-out"
              >
                ✖
              </button>
              <div className="flex items-center gap-3">
                <img
                  src={notification.senderId.profilePic || '/default-profile.jpg'}
                  alt="Profile"
                  className="w-10 h-10 rounded-full border border-gray-300 shadow-sm"
                />
                <div>
                  <p className="text-sm">
                    <span className="text-blue-600 font-semibold cursor-pointer">
                      {notification.senderId.username}
                    </span>{' '}
                    {notification.body}
                  </p>
                  <p className="text-xs text-gray-500">{new Date(notification.createdAt).toLocaleString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
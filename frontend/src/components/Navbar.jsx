import React, {useEffect,useState, useRef, useContext} from 'react';
import { useNavigate } from "react-router-dom";
import logo from '/images/logo.jpeg';
import { FaBell } from 'react-icons/fa';
import {jwtDecode} from "jwt-decode";
import api from "../api/api";
import { AuthContext } from "./AuthContext";


const Navbar = ({ username, profilePic }) => {

  const [notificationCount, setNotificationCount] = useState(0);

    const { token, authuser } = useContext(AuthContext);


  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  


  const BACKEND_URL = 'http://localhost:7000';
  const profilePicUrl =
    profilePic === '/images/default_profile.jpeg'
      ? '/images/default_profile.jpeg'
      : `${profilePic}`;

    const navigate=useNavigate();

    function sendFeedback(){
      // console.log("Send feedback!");
      navigate('/feedback');
    }

      // Close dropdown if clicked outside
      useEffect(() => {
        const handleClickOutside = (e) => {
          if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
            setOpen(false);
          }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
      }, []);
    

 
 
   // ✅ Function to fetch unread notifications count
   const fetchNotificationCount = async () => {
    try {

      if (!token || !authuser){
        
        return;
      };

      // const decoded = jwtDecode(token);
      // const userId = decoded.userId;

      const res = await api.get(`/notifications/unread/count/${authuser.userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("res");
      console.log(res);

      // ✅ Update notification count
      setNotificationCount(res.data.unreadCount);
    } catch (error) {
      console.error("Error fetching notification count", error);
    }
  };

  // ✅ Fetch notifications every 5 seconds
  useEffect(() => {
    fetchNotificationCount(); // Fetch once on mount

    const intervalId = setInterval(() => {
      fetchNotificationCount();
    }, 5000);

    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, []);


  const toggleGoogleTranslate = () => {
    const translateDiv = document.getElementById('google_translate_element');
    if (translateDiv) {
      translateDiv.classList.toggle('hidden');
    }
  };



  return (
    <nav className="fixed top-0 left-0 w-full flex flex-wrap justify-between items-center py-3 px-4 bg-gray-100 border-b-2 border-gray-300 z-10 shadow-md">
      {/* Left side: Brand Logo and Tagline */}
      <div className="flex items-center space-x-3">
        {/* <img src={logo} alt="Friendsbook logo" className="w-10 h-10 sm:w-12 sm:h-12" /> */}
        <div className="text-base sm:text-lg">
          <h1 className="font-bold text-[#3b5998] text-xl">friendsbook</h1>
          <p className="text-xs sm:text-sm text-gray-600">Be Social . Be Popular</p>
        </div>
      </div>

      {/* Right side: Profile Picture and Username */}
      <div className="flex items-center space-x-2 cursor-pointer" > 


     {/* <div className="relative cursor-pointer mr-4" onClick={()=>{navigate('/notifications')}}>
      <FaBell size={24} color="#3b5998" />

    
        {notificationCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full animate-bounce">
              {notificationCount > 99 ? "99+" : notificationCount}
            </span>
          )}

     </div> */}

        {/* <img
          src={profilePicUrl}
          alt="Profile"
          onClick={()=>navigate(`/profile`)}
          className="w-8 h-8 sm:w-10 sm:h-10 rounded-md object-cover"
        />
        <p className="text-sm sm:text-base font-medium text-gray-800 truncate max-w-[6rem] sm:max-w-[10rem]" onClick={()=>navigate(`/profile`)}>
          {username || 'Username'}
        </p> */}

<div className="relative inline-block text-left" >
      {/* Profile Summary (clickable) */}
      <div
        onClick={()=>{navigate("/profile")}}
        className="flex items-center gap-2 cursor-pointer"
      >
        <img
          src={profilePicUrl}
          alt="Profile"
          className="w-8 h-8 sm:w-10 sm:h-10 rounded-md object-cover"
        />
        <p className="text-sm sm:text-base font-medium text-gray-800 truncate max-w-[6rem] sm:max-w-[10rem]">
          {username || 'Username'}
        </p>
      </div>

      
    </div>

      </div>
    </nav>
  );
};

export default Navbar;

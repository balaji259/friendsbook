import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChatStore } from './useChatStore';
import { AuthContext } from './AuthContext';
import api from '../api/api';
import './scroll.css';
import Lottie from "lottie-react";
import fireAnimation from "../assets/fire.json"; // Adjust path as needed

const SuggestionsSidebar = () => {
  const [streakCount, setStreakCount] = useState(0);
  const [topStreakUsers, setTopStreakUsers] = useState([]);
  const { profileId, setProfileId } = useChatStore();
  const { authuser } = useContext(AuthContext);
  const currentUserId = authuser?.userId;
  const navigate = useNavigate();

  const fetchUserData = async () => {
    try {
      const response = await api.get(`/profile/me`);
      setStreakCount(response.data.streak.count);
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    api.get(`/streak/top-streaks`)
      .then(response => {
        setTopStreakUsers(response.data);
      })
      .catch(error => console.error('Error fetching top streak users:', error));
  }, []);


  useEffect(()=>{
    if(profileId!=null){
      if(profileId==currentUserId)
        navigate('/profile');
      else
        navigate('/other');
    }
  },[profileId]);

  const handleNavigation=async(userId)=>{
    console.log("id bro");
    console.log(userId);

    setProfileId(userId);

    // navigate(`/other/${userId}`)
  // userId===currentUserId?navigate(`/profile`):navigate(`/other/${userId}`);
  }




  return (
    <div  className="sidebar-container" style={sidebarStyle}>
      <div style={streakTableStyle}>
        <h3 style={streakTableHeaderStyle}>Popular Streaker</h3>
        {topStreakUsers.map((user, index) => (
          <div key={user._id} style={streakUserStyle} onClick={()=>handleNavigation(user._id)}>
            <img src={user.profilePic === '/images/squarepfp.png' ? '/images/squarepfp.png' : `${user.profilePic}`} alt='profilePic' style={profilePicStyle} />
            <div style={userInfoStyle}>
              <span style={usernameStyle}>{user.username}</span>
              <div style={streakInfoStyle}>
                {/* <img src="/images/fireon.svg" alt="Streak Icon" style={streakIconStyle} /> */}
                <Lottie animationData={fireAnimation} loop={true} style={streakIconStyle} />
                <span style={streakCountStyle}>{user.streak.count}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

};

// Inline Styles
const sidebarStyle = {
  position: 'fixed',
  // right: '10px',
  right:'0px',
  top: '60px',
  height: 'calc(100vh - 60px)', // Full height minus top offset
  backgroundColor: '#f1f3f5',
  // backgroundColor:"red",
  padding: '15px',
  paddingTop: '50px',
  display: 'flex',
  flexDirection: 'column',
  borderLeft: '1px solid #e1e1e1',
  overflowY: 'auto', // Enable scrolling for the entire sidebar
};


// Streak Table Style - Remove scrolling and let content display fully
const streakTableStyle = {
  width: '100%',
  backgroundColor: '#f1f1f1',
  padding: '10px',
  marginBottom: '20px', // Add space between streak table and suggestions
};

const streakTableHeaderStyle = {
  textAlign: 'center',
  marginBottom: '10px',
  fontWeight: 'bold',
};

const streakUserStyle = {
  display: 'flex',
  alignItems: 'center',
  backgroundColor: '#f5f5f5',
  padding: '10px',
  margin: '8px 0',
  cursor:"pointer"

};

const profilePicStyle = {
  width: '40px',
  height: '40px',
  borderRadius: '5px',
  marginRight: '10px',
};

const userInfoStyle = {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
};

const usernameStyle = {
  fontWeight: 'bold',
  fontSize: '14px',
};

const streakInfoStyle = {
  display: 'flex',
  alignItems: 'center',
  marginTop: '5px',

};

const streakIconStyle = {
  width: '20px',
  height: '20px',
  marginRight: '5px',
};

const streakCountStyle = {
  fontSize: '12px',
};

const continueButtonStyle = {
  width: '100%',
  padding: '10px',
  backgroundColor: '#c3c3c3',
  textAlign: 'center',
  cursor: 'pointer',
  border: 'none',
};

export default SuggestionsSidebar;


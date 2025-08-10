import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useChatStore } from './useChatStore';
import './scroll.css';
import Lottie from "lottie-react";
import fireAnimation from "../assets/fire.json"; // Adjust path as needed
const SuggestionsSidebar = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [streakCount, setStreakCount] = useState(0);
  const [topStreakUsers, setTopStreakUsers] = useState([]);
  const { profileId, setProfileId }=useChatStore();
  const backendBaseUrl='http://localhost:7000';
  const renderurl="https://socialmedia-backend-2njs.onrender.com";
  

  const navigate=useNavigate();


  const getUserIdFromToken = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.userId;
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
};

    const currentUserId = getUserIdFromToken();

    const handleFollow = async (followId) => {
      try {
          const token = localStorage.getItem('token');
          
          await axios.post(
              `http://localhost:7000/user/search/followsug`,
              { userId: currentUserId, followId },
              { headers: { Authorization: `Bearer ${token}` } }
          );

          // Update the suggestedUsers list by removing the followed user
          setSuggestions(prev => prev.filter(user => user._id !== followId));
      } catch (error) {
          console.error('Error following user:', error);
      }
  };


  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You are not logged in. Please log in to view your profile.');
        return;
      }

      const response = await fetch(`http://localhost:7000/profile/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setStreakCount(data.streak.count);
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    }
  };

  const fetchUserSuggestions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/user/suggestions`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Unauthorized access');
      }

      const data = await response.json();

      if (data.users && Array.isArray(data.users)) {
        setSuggestions(data.users);
      } else {
        console.error("Unexpected data format:", data);
      }
    } catch (error) {
      console.error('Failed to fetch user suggestions:', error);
    }
  };

  useEffect(() => {
    fetchUserSuggestions();
    fetchUserData();
  }, []);

  useEffect(() => {
    axios.get(`/streak/top-streaks`)
      .then(response => {
        console.log(response);
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
        {/* <button style={continueButtonStyle}>Continue</button> */}
      </div>

      {/* <div style={headingSuggestionsStyle}>User Suggestions</div>

      <div style={suggestionsContainerStyle}>
        {suggestions.map((user) => (
          <div key={user.username} style={suggestionStyle}>
            
            <div style={suggestionTopStyle} onClick={()=> handleNavigation(user._id)}>
              <img src={user.profilePic === '/images/default_profile.jpeg' ? '/images/default_profile.jpeg' : `${user.profilePic}`} alt={user.username} style={profilePicStyle} />
              <p style={usernameTextStyle}>@{user.username}</p>
              <p style={bioTextStyle}>{user.bio || 'No Bio'}</p>
            </div>
            <button style={followButtonStyle} onClick={() => handleFollow(user._id)}>Follow</button>
          </div>
        ))}
      </div> */}
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

const headingSuggestionsStyle = {
  marginTop: '14px',
  marginBottom: '4px',
  textAlign: 'center',
  fontWeight: 'bold',
};

const suggestionsContainerStyle = {
  color: '#333',
  fontSize: '1.1em',
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  alignItems: 'center',
};


const suggestionStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  backgroundColor: '#ffffff',
  border: '1px solid #ddd',
  borderRadius: '8px',
  padding: '12px',
  width: '90%',
  maxWidth: '300px',
  textAlign: 'center',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  marginBottom: '8px',
};

const suggestionTopStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginBottom: '8px',
  cursor:"pointer"
  
};

const usernameTextStyle = {
  fontSize: '1em',
  color: '#333',
  fontWeight: '500',
  margin: 0,
};

const bioTextStyle = {
  fontSize: '0.85em',
  color: '#666',
  marginBottom: '10px',
};

const followButtonStyle = {
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  padding: '8px 0',
  cursor: 'pointer',
  fontSize: '0.85em',
  width: '100%',
  transition: 'background-color 0.3s',
};

export default SuggestionsSidebar;

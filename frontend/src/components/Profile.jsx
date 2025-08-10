import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import Dashboard from './Dashboard';
import Details from './Details';
import {useSocket} from "./useSocket";
import axios from "axios";

import { fetchUserDetails } from './userPosts.js';

const Profile =()=>{

    const [currentuser, setCurrentUser] = useState({ username: "", profilePic: "" });
    const {user,setUser,socket,connectSocket}= useSocket();
    const backendBaseUrl="http://localhost:7000"; 
    const renderurl="https://socialmedia-backend-2njs.onrender.com";

  useEffect(() => {
    const token = localStorage.getItem("token");
    
    const getUserDetails = async () => {
      const userDetails = await fetchUserDetails(token);
      console.log("userDetails");
      console.log(userDetails);
      if (userDetails) {
        setCurrentUser({ username: userDetails.username, profilePic: userDetails.profilePic });
      }
     
    };

    getUserDetails();
  }, []);


  async function getUser(){
    try{
        const token=localStorage.getItem("token");
        const res=await axios.get(`/user/getUser`,{
            headers: {
                Authorization:`Bearer ${token}`,
            },

        })
       
        setUser(res.data);
    }
    catch(e){
        console.log(e);
    }
}

useEffect(()=>{
   
    getUser();
},[]);





    return (
      <div style={styles.container}>
      {/* Navbar */}
      <div style={styles.navbar}>
        <Navbar username={currentuser.username} profilePic={currentuser.profilePic} />
      </div>

      {/* Main content wrapper */}
      <div style={styles.contentWrapper}>
        {/* Sidebar (Dashboard) */}
        <div style={{ ...styles.sidebar, width: getSidebarWidth() }}>
          <Dashboard />
        </div>

        {/* Main content (SearchSuggestions) */}
        <div style={styles.mainContent}>
          <Details />
        </div>
      </div>
    </div>
      );


}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100vh", // Full viewport height
    fontFamily: "'Arial', sans-serif",
    overflow: "hidden", // Prevent overflow
    backgroundColor: "#d5d5d5",
  },
  navbar: {
    flexShrink: 0,
    zIndex: 1000, // Ensure Navbar stays on top
    position: "sticky",
    top: 0,
    backgroundColor: "#fff",
    boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
  },
  contentWrapper: {
    display: "flex",
    flex: 1,
    overflow: "hidden",
    marginTop: "60px", // Ensure the content starts below the navbar
    backgroundColor: "#d5d5d5",
  },
  sidebar: {
    backgroundColor: "#f9f9f9",
    boxShadow: "2px 0 5px rgba(0, 0, 0, 0.1)",
    overflowY: "auto",
    // padding: "10px 0px 10px 10px",
    height: "calc(100vh - 60px)", // Ensure the Dashboard fits within the viewport height
    display: "flex",
    flexDirection: "column",
  },
  mainContent: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    overflowY: "auto",
    // padding: "20px",
  
    backgroundColor: "#fff",
    height: "calc(100vh - 60px)", // Ensure the content area fits the remaining space
  },
};

// Adjusting dynamic styles for responsiveness
const getSidebarWidth = () => {
  if (window.innerWidth < 600) return "20%"; // Small screens
  if (window.innerWidth < 900) return "25%"; // Medium screens
  if (window.innerWidth < 1700) return "20%"; 
  return "20%"; // Larger screens
};

  export default Profile;
import React, { useEffect, useState, useContext } from "react";
import Navbar from "./Navbar";
import Dashboard from "./Dashboard";
import Quote from "./Quote.jsx";
import FetchFriends from "./FetchFriends.jsx";
import {useSocket} from "./useSocket";
import api from "../api/api";
import { AuthContext } from "./AuthContext";

const Friends = () => {
  const { authuser } = useContext(AuthContext);
  const {user,setUser,socket,connectSocket}= useSocket();
  const [isLoading, setIsLoading] = useState(true); 


  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await api.get(`/user/getUser`);
        setUser(res.data);
      } catch (e) {
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    };

    getUser();
  }, [setUser]);

if(isLoading)
{
  return <Quote />;
}


  // Styles for layout and responsiveness
  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      height: "100vh", // Full viewport height
      fontFamily: "'Arial', sans-serif",
      overflow: "hidden", // Prevent overflow
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
    },
    sidebar: {
      backgroundColor: "#f9f9f9",
      boxShadow: "2px 0 5px rgba(0, 0, 0, 0.1)",
      overflowY: "auto",
      // padding: "10px",
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
  // const getSidebarWidth = () => {
  //   if (window.innerWidth < 600) return "20%"; // Small screens
  //   if (window.innerWidth < 900) return "25%"; // Medium screens
  //   if (window.innerWidth < 1700) return "20%"; 
  //   return "20%"; // Larger screens
  // };

  const getSidebarWidth = () => {
    if (window.innerWidth < 768) return "70px";
    return "18%";
  };


  return (
    <div style={styles.container}>
      {/* Navbar */}
      <div style={styles.navbar}>
        <Navbar username={authuser?.username} profilePic={authuser?.profilePic} />
      </div>

      {/* Main content wrapper */}
      <div style={styles.contentWrapper}>
        {/* Sidebar (Dashboard) */}
        <div style={{ ...styles.sidebar, width: getSidebarWidth() }}>
          <Dashboard />
        </div>

        {/* Main content (SearchSuggestions) */}
        <div style={styles.mainContent}>
          <FetchFriends />
        </div>
      </div>
    </div>
  );
};

export default Friends;
import React, { useEffect, useState, useContext } from "react";
import Navbar from "./Navbar";
import Dashboard from "./Dashboard";
import SuggestionsSidebar from "./Suggestions";
import { toast } from "react-hot-toast";
import PostsComponent from "./Posts";
import Quote from "./Quote.jsx";
import {useSocket} from "./useSocket";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import api from "../api/api.js";

// import { fetchUserDetails } from "./userPosts.js";




import { messaging, getToken, onMessage } from './notifications/firebase.js';


import { useChatStore } from "./useChatStore";
import { Navigate } from "react-router-dom";

const Home = () => {
  const [currentuser, setCurrentUser] = useState({ username: "", profilePic: "" });
  const [isSidebarVisible, setIsSidebarVisible] = useState(false); 
  const {user,setUser,socket,connectSocket}= useSocket();
  const [isLoading, setIsLoading] = useState(true); 
    const { token, authuser } = useContext(AuthContext);
  // const backendBaseUrl="http://localhost:7000"; 

  // const renderurl="https://socialmedia-backend-2njs.onrender.com";

  const navigate=useNavigate();
 
useEffect(()=>{

  if(!token)
  {
    navigate('/');
    return;
  }

},[])


//for push notifications ! 
 
  onMessage(messaging, (payload) => {
    console.log('Notification received:', payload);
    alert(payload.notification.title + '\n' + payload.notification.body);
  });

  useEffect(() => {
    console.log("in effect ");
    console.log("user");
    console.log(user);
    if(user){
      console.log("inside if stateent !");
      console.log("user.userId");
      console.log(user?.userId);
      const requestPermission = async () => {
        console.log('🔹 Requesting permission for notifications...');
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          console.log('✅ Notification permission granted');
          
          try {
            // 🔹 Get FCM Token
            const token = await getToken(messaging, { vapidKey: 'BIWYQ0KsMfECUsw5MC85iKTB6OGDQpP4p-lhZLFmHpyk9JS-6d5k2A_41do5zdbzkqe8ikyeMwRy6wo33nKisl4' });
            console.log('✅ FCM Token:', token);
            
            // 🔹 Send token to backend
            await api.post('/update-fcm-token', {
              userId:user.userId,
              token,
            });
            
            console.log('✅ FCM Token sent to backend!');
          } catch (error) {
            console.error('🚨 Error getting FCM token:', error);
          }
        } else {
          console.warn('🚨 Notification permission denied');
        }
      };
      
      requestPermission();
    }
  }, [user]);


  // useEffect(()=>{
  //   console.log("caling get token bro")
  //   getToken(messaging, { vapidKey: 'BIWYQ0KsMfECUsw5MC85iKTB6OGDQpP4p-lhZLFmHpyk9JS-6d5k2A_41do5zdbzkqe8ikyeMwRy6wo33nKisl4' })
  // .then(token => console.log('Token:', token))
  // .catch(err => console.error('Error getting token:', err));
  // },[]);

  //notification check:
//   const sendNotification = async () => {
//     try {
//         const response = await fetch("http://localhost:7000/send-notification", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({
//                 userId: "67c343222142a971928c836c",  // Replace with actual userId
//                 title: "New Message",
//                 body: "Loading home page",
//             }),
//         });

//         const data = await response.json();
//         console.log("data");
//         console.log(data);
//         // toast.success(`${data.title}: ${data.body}`, { position: "top-right" });
//         console.log("Notification Response:", data);
//     } catch (error) {
//         console.error("Error sending notification:", error);
//     }
// };

// Call the function to test


const fetchUserDetails = async () => {
  if (!token) {
    navigate("/");
    return;
  }

  try {
    console.log("start");

    const response = await api.get(`/user/getdetails`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("end");

    console.log("response:", response.data);

    
    return response.data; 

  } catch (error) {
    console.error("Error fetching user details:", error);
    alert("Error fetching user details");
  }
};
  
  
 

// Determine sidebar visibility based on screen width
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1200) {
        setIsSidebarVisible(true); // Open by default for larger screens
      } else {
        setIsSidebarVisible(false); // Closed by default for medium and smaller screens
      }
    };

    // Initialize the sidebar state on load
    handleResize();

    // Add resize event listener
    window.addEventListener("resize", handleResize);

    // Cleanup event listener on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
  
    if(!token)
    {
     toast.error("Please login again !");
     navigate('/'); 
    }

    const getUserDetails = async () => {
      
      if(!token){
      
        return;
      }
      
      try {

        const userDetails = await fetchUserDetails(token);
        console.log(`userDetails:${userDetails}`);
        if (userDetails) {
          setCurrentUser({ username: userDetails.username, profilePic: userDetails.profilePic });
        }
      } catch (error) {
        console.log("error");
        console.log(error.message);
        console.error("Error fetching user details:", error);
      } finally {
        setIsLoading(false); 
      }
    };
    
    getUserDetails();
  }, []);

 
  
  async function getUser(){
    try{
      const token=localStorage.getItem("token");
      const res=await api.get(`/user/getUser`,{
        headers: {
          Authorization:`Bearer ${token}`,
        },
        
        })
       console.log("setting res.data");
       console.log(res.data);
        setUser(res.data);
    }
    catch(e){
      console.log("error here in catch");
      console.log(e);
    }
  }
  
  useEffect(()=>{
    console.log("loading home page!");
    getUser();
    


  },[]);




  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  const getSidebarWidth = () => {
    if (window.innerWidth < 600) return "11%";
    if (window.innerWidth < 900) return "15%";
    return "15%";
  };

  useEffect(() => {
    const container = document.createElement('div');
    container.classList.add('falling-roses-container');
    document.body.appendChild(container);

    for (let i = 0; i < 20; i++) {
      const petal = document.createElement('div');
      petal.classList.add('falling-petal');
      petal.style.left = `${Math.random() * 100}vw`;
      petal.style.animationDuration = `${2 + Math.random() * 3}s`;
      container.appendChild(petal);
    }

    setTimeout(() => {
      container.remove(); // Remove petals after animation
    }, 5000);
  }, []);



  if (isLoading) {
  
    return <Quote />;
  }

  return (
    <div style={styles.container}>
      {/* Navbar */}
      <div style={styles.navbar}>
        <Navbar username={currentuser.username} profilePic={currentuser.profilePic} />
      </div>

      {/* Main content */}
      <section style={styles.content}>
        {/* Dashboard Sidebar */}
        <div style={{ ...styles.dashboard, width: getSidebarWidth() }}>
          <Dashboard />
        </div>

        {/* Posts Section */}
        <div
          style={{
            ...styles.posts,
            marginRight: isSidebarVisible ? "0" : "5%", // Adjust space when sidebar is hidden
          }}
        >
          <PostsComponent />
        </div>

        {/* Suggestions Sidebar */}
        {/* <div
          style={{
            ...styles.suggestionsSidebar,
            width: isSidebarVisible ? getSidebarWidth() : "0", // Smoothly hide sidebar
            transition: "width 0.3s ease-in-out",
            overflow: isSidebarVisible ? "auto" : "hidden", // Prevent overflow when hidden
            zIndex: isSidebarVisible && window.innerWidth < 900 ? 1000 : "auto", // For smaller screens, overlay suggestions
          }}
        >
          {isSidebarVisible && (
            <>
              <button style={styles.closeButton} onClick={toggleSidebar}>
                ✕
              </button>
              <SuggestionsSidebar />
            </>
          )}
        </div>

       
        {!isSidebarVisible && (
          <button style={styles.openButton} onClick={toggleSidebar}>
            ☰
          </button>
        )} */}
      </section>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    fontFamily: "'Arial', sans-serif",
    overflow: "hidden",
    backgroundColor: "#d5d5d5",
  },
  navbar: {
    flexShrink: 0,
    zIndex: 1000,
    position: "sticky",
    top: 0,
    backgroundColor: "#fff",
    boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
  },
  content: {
    display: "flex",
    flex: 1,
    columnGap:"10px",
    marginTop: "60px",
    overflow: "hidden",
    backgroundColor: "#d5d5d5",
  },
  dashboard: {
    backgroundColor: "#f9f9f9",
    overflowY: "auto",
    height: "calc(100vh - 60px)",
    display: "flex",
    flexDirection: "column",
    // border:"2px solid red",
  },
  posts: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    overflowY: "auto",
    backgroundColor: "#d5d5d5",
  },
  suggestionsSidebar: {
    backgroundColor: "#d5d5d5",
   
    height: "calc(100vh - 60px)",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    transition: "width 0.3s ease-in-out", // Smooth transition for opening/closing
  },
  closeButton: {
    position: "fixed", // Fixed position for visibility
    top: "80px", // Place it below the navbar
    right: "-10px", // Aligned to the right
    padding: "10px 30px 10px 15px",
    backgroundColor: "#ff4d4d",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "14px",
    zIndex: 1100,
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
  },
  openButton: {
    position: "fixed",
    top: "80px", // Below Navbar
    right: "-10px",
    padding: "10px 30px 10px 15px",
    backgroundColor: "#3b5998",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "14px",
    zIndex: 1000,
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
  },
};

export default Home;


import React,{useState, useContext} from "react";
import { toast } from 'react-hot-toast';
import {useEffect} from "react";
import { useNavigate } from "react-router-dom";
import "./dashboard.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { faMessage } from "@fortawesome/free-solid-svg-icons";
import { faUserGroup } from "@fortawesome/free-solid-svg-icons";
import { faRotate } from "@fortawesome/free-solid-svg-icons";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { faKey } from '@fortawesome/free-solid-svg-icons';
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { faNewspaper } from "@fortawesome/free-solid-svg-icons";
import { faEnvelope, faCommentDots } from "@fortawesome/free-solid-svg-icons";

import { faUsers, faPeopleGroup, faNetworkWired, faCircleNodes } from '@fortawesome/free-solid-svg-icons';

import { AuthContext } from "./AuthContext";

import {useSocket} from "./useSocket";

const Dashboard = () => {
  const navigate = useNavigate();

  const {user, setUser ,socket, connectSocket,disconnectSocket} =useSocket();
  const {setToken, setAuthUser} = useContext(AuthContext);


  const handleLogout = () => {
    
    

    if (socket) {
           console.log("socket value before unmount in dashbaor5r",socket.id);
             disconnectSocket();
             console.log("socket value after  unmount dashboard",socket.id);
             console.log("Socket disconnected on unmount.");
    }
    else{
      console.log("socket is:",socket);
    }

  setToken(null);
  setAuthUser(null);

    localStorage.clear();
    navigate("/");
  };

 

  function inviteFriends(){
    navigator.clipboard.writeText(`https://www.friendsbook.online`)
    .then(() => toast.success("website link copied! Share it to your friends."))
    .catch(err => console.error('Failed to copy:', err));
  }

 

  return (
    <div className="dashboard">
      {/* Sidebar */}
      
      <div className="sidebar">
        {/* Top Section */}
        <div className="menu">
          <button className="menu-item tooltip" onClick={() => navigate("/home")}>
         <FontAwesomeIcon icon={faNewspaper} id="home" />
        
         {/* <br /> */}
          {/* Home */}
          <span className="menu-text">Feed</span>
          </button>
          <button className="menu-item tooltip" onClick={() => navigate("/search")}>
          {/* <FontAwesomeIcon icon={faMagnifyingGlass} id="search" />  */}
          <FontAwesomeIcon icon={faUserGroup} id="friendcircle"  />
          {/* <br /> */}
      
          {/* Search */}
          <span className="menu-text">Friends</span>
          </button>
          {/* <button className="menu-item tooltip" onClick={() => navigate("/friends")}> <span className="stacked-text">
          <FontAwesomeIcon icon={faUserGroup} id="friendcircle"  />
          {/* <br /> */}
    
          {/* Friend<br />Circle */}
          {/* <span className="menu-text">Friends</span> */}
          {/* </span></button>  */}
          <button className="menu-item tooltip" onClick={()=> navigate("/chats")}>
          <FontAwesomeIcon icon={faMessage} id="chats" />

          {/* <br /> */}
           {/* Chats */}
           <span className="menu-text">Chats</span>
            </button>
          


          
        <button className="menu-item tooltip" onClick={()=>{navigate('/key/management')}}>
          <FontAwesomeIcon icon={faKey} id="access-key" />

           <span className="menu-text">Key</span>
          </button>


        

          <button className="menu-item tooltip" onClick={()=>{navigate('/feedback')}}>
          <FontAwesomeIcon icon={faCommentDots} id="feedback" />  
           <span className="menu-text">Feedback</span>
          </button>


          <button className="menu-item tooltip" onClick={() => navigate("/profile")}>
           <FontAwesomeIcon icon={faUser}  id="profile" />

           <span className="menu-text">Profile</span>
          </button>



        </div>

        {/* Bottom Section */}
        <div className="logout">
          {/* <button
            onClick={handleLogout}
            className="logout-btn"
          >
            Logout
          </button> */}

        <button className="menu-item tooltip" onClick={handleLogout}>
           <FontAwesomeIcon icon={faArrowRightFromBracket} id="logouticon" />

           {/* <br /> */}
           {/* Refresh */}
           <span className="menu-text">Logout</span>
          </button>


        </div>
      </div>
     
      </div>
    
  );


};

export default Dashboard;

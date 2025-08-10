import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./NewPosts.css";
import api from "../api/api";
import { FiLogOut } from "react-icons/fi";
import { AuthContext } from "./AuthContext";
const App = () => {
  const [activeTab, setActiveTab] = useState(null);

  const [userData,setUserData]=useState(null);
  const [userPosts,setUserPosts]=useState([]);
  const [savedPosts,setSavedPosts]=useState([]);
  const [likedPosts,setLikedPosts]=useState([]);
  const [selectedPost,setSelectedPost]=useState(null);
  const {token, authuser} = useContext(AuthContext);

  const buttonRef=useRef(null);
  const navigate=useNavigate();
  
  useEffect(() => {

    setTimeout(() => {
      if (buttonRef.current) {
  
        buttonRef.current.click();
      }
    }, 1000);
    
  }, []); 

  const fetchUserData = async () => {
    try {
      
        if (!token) {
            alert('You are not logged in. Please log in to view your profile.');
            return;
        }
    
        const response = await api.get(`/profile/me`, {
          
            headers: {
                'Authorization': `Bearer ${token}`,
                
            },
        });

        // console.log(response.json().data);

        setUserData(response.data);
       
        
    } catch (error) {
        console.error('Failed to fetch user data:', error.message);

    }
};


useEffect(() => {
    fetchUserData();
}, []);

useEffect(() => {
    if (userData) {
        console.log("User ID:", userData._id);
    }
}, [userData]);



  const fetchUserPosts = async () => {
    try {
        const userId = userData._id;
        console.log(userId);

        if (userData) {
            const response = await api.get(`/profile/userPosts/${userId}`,{
              headers: {
                'Authorization': `Bearer ${token}`,
                
            },
            });
            

            setUserPosts(response.data.posts || []);
        } else {
            console.log("No user data!");
        }
    } catch (error) {
        console.error('Error fetching user posts:', error);
        setUserPosts([]);
    }
};


const fetchSavedPosts = async () => {
    try {
        console.log("entered fetch User Saved");
        const userId = userData._id;
        console.log(userId);

        if (userData) {
            const response = await api.get(`/profile/savedPosts/${userId}`,{
              headers: {
                'Authorization': `Bearer ${token}`,
                
            },
            });
            

            setSavedPosts(response.data || []);
            
        } else {
            console.log("No user data!");
        }
    } catch (error) {
        console.error('Error fetching user posts:', error);
        setSavedPosts([]);
    }
};


  const fetchLikedPosts = async () => {
    try {
        const userId=userData._id;
        console.log(userId);

        const response = await api.get(`/profile/likedPosts/${userId}`,{
          headers: {
                'Authorization': `Bearer ${token}`,
                
            },
        });
        console.log(response);
        setLikedPosts(response.data);
    } catch (error) {
        console.error('Error fetching liked posts:', error);
        setLikedPosts([]);
    }
};


useEffect(()=>{
    console.log("actuveTab changed!");
    if(userData){
        if(activeTab==="posts")
            fetchUserPosts();
        else if(activeTab==="saved")
            fetchSavedPosts();
        else
            fetchLikedPosts();
    }
  },[activeTab])



  const renderPosts = () => {
    const data =
      activeTab === "posts"
        ? userPosts
        : activeTab === "saved"
        ? savedPosts
        : likedPosts;

        return (
            <div className="grid-container">
  {data.map((post) => {
    // Determine whether to use post or post.postId
    const currentPost = post.postId || post;

    return (
      <div
        key={currentPost._id}
        className="grid-item"
        onClick={() => setSelectedPost(currentPost)}
      >
       
        {currentPost.content?.mediaUrl && currentPost.postType === "image" && (
          <img
            src={currentPost.content.mediaUrl}
            alt={`Post ${currentPost._id}`}
          />
        )}
        {currentPost.content?.mediaUrl && currentPost.postType === "video" && (
          <video
            
            src={currentPost.content.mediaUrl}
            alt={`Post ${currentPost._id}`}
          />
        )}
        {currentPost.caption && <p>{currentPost.caption}</p>}
      </div>
    );
  })}

  {/* Modal Section */}
  {selectedPost && (
    <div
      className="modal-overlay"
      onClick={() => setSelectedPost(null)} // Close modal on overlay click
    >
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()} // Prevent overlay click from closing modal
      >
        <button
          className="close-button"
          onClick={() => setSelectedPost(null)} // Close modal on button click
        >
          &times;
        </button>
        {selectedPost.content?.mediaUrl && selectedPost.postType==="image" && (
          <img
            src={selectedPost.content.mediaUrl}
            alt={`Selected Post ${selectedPost._id}`}
            className="modal-image"
          />
        )}
        {selectedPost.content?.mediaUrl && selectedPost.postType==="video" && (
          <video
            controls
            src={selectedPost.content.mediaUrl}
            alt={`Selected Post ${selectedPost._id}`}
            className="modal-image"
          />
        )}
        {selectedPost.caption && (
          <p className="modal-caption">{selectedPost.caption}</p>
        )}
      </div>
    </div>
  )}
</div>

          );
         
  };


 
const goToHome = () => {
  navigate("/profile"); 
};


  return (

    <>

  <button className="modern-back-button" onClick={goToHome}>
        <span className="arrow">
          
        <FiLogOut size={25}   style={{ transform: 'scaleX(-1)' }}/>
          </span> 
      </button>
      
    
    
    <div className="App">
      <div className="button-container">
        <button
          ref={buttonRef}
          className={activeTab === "posts" ? "active" : ""}
          onClick={() => setActiveTab("posts")}
        >
          Posts
        </button>
        <button
          className={activeTab === "saved" ? "active" : ""}
          onClick={() => setActiveTab("saved")}
        >
          Saved
        </button>
        <button
          className={activeTab === "liked" ? "active" : ""}
          onClick={() => setActiveTab("liked")}
        >
          Liked
        </button>
      </div>
      <div className="posts-container">{renderPosts()}</div>
    </div>
    
    </>
  );
};

export default App;
import React, { useEffect, useState } from 'react';
import { Trash, HeartOff, BookmarkMinus } from "lucide-react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import "./details.css";
import LoadingPage from './Loading';
function UserDetails() {
    const [userData, setUserData] = useState(null);
    const [sectionData, setSectionData] = useState([]);
    const [savedData, setSavedData] = useState([]);
    const [likedData,setLikedData]=useState([]);
    // const [activeSection, setActiveSection] = useState('posts');
    const [activeSection, setActiveSection] = useState("posts");
    const [error, setError] = useState(null);
    const [friendSuggestions, setFriendSuggestions] = useState([]);

    const [isEditing, setIsEditing] = useState(false);
    const [editableData, setEditableData] = useState({});
    const [previewImage, setPreviewImage] = useState(null);

    const [suggestions, setSuggestions] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    const [selectedPost, setSelectedPost] = useState(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState([]);

    const navigate=useNavigate();

    const token=localStorage.getItem('token');
    const backendBaseUrl = 'http://localhost:7000';
    const renderurl="https://socialmedia-backend-2njs.onrender.com";
 

    const openModal = async (type) => {
      let userIds = [];
      if (type === 'followers') {
          userIds = userData.followers;
      } else if (type === 'following') {
          userIds = userData.following;
      }
  
      try {
          // Fetch user details from backend
          const response = await fetch(`/user/getUsersByIds`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ userIds }),
          });
          const userDetails = await response.json(); // [{ _id, username }, ...]
        
         

          const userDetailsForModal = userDetails.map(user => ({
            userId: user._id, // Assuming `_id` is the user's ID field
            username: user.username,
          }));
          setModalContent(userDetailsForModal);
      
          
          
          setIsModalOpen(true);
      } catch (error) {
          console.error('Error fetching user details:', error);
      }
  };
  

    const closeModal = () => {
      setIsModalOpen(false);
      setModalContent([]);
    };

    useEffect(() => {
        fetchUserData();

        
    }, []);

    useEffect(() => {
        if (userData) {
            setEditableData({
                username: userData.username,
                fullname: userData.fullname,
                relationshipStatus: userData.relationshipStatus,
                bio: userData.bio,
                profilePic: userData.profilePic,
                dateOfBirth: userData.dateOfBirth || '', // New fields
                collegeName: userData.collegeName || '',
                bestFriend: userData.bestFriend || '',
                interests: userData.interests || '',
                favoriteSports: userData.favoriteSports || '',
                favoriteGame: userData.favoriteGame || '',
                favoriteMusic: userData.favoriteMusic || '',
                favoriteMovie: userData.favoriteMovie || '',
                favoriteAnime: userData.favoriteAnime || '',
                favoriteActor: userData.favoriteActor || '',
            });
        }
    }, [userData]);

    const handleUnsavePost = async (postId) => {
        try {
            console.log("handledeletepost fucntion");
          const response = await fetch(`/profile/deleteSavedPost/${postId}`, {
            method: "DELETE",
          });
          if (response.ok) {
            // Update the saved posts list
            setSavedData((prevData) => prevData.filter((post) => post._id !== postId));

            toast.success("Post removed from savedPosts!");
          } else {
            toast.success("Failed to delete the post. Please try again.");
          }
        } catch (error) {
          console.error("Error deleting post:", error);
          // alert("An error occurred. Please try again.");
        }
      };
      

    const fetchUserData = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('You are not logged in. Please log in to view your profile.');
                window.location.href = 'index.html';
                return;
            }

            const response = await fetch(`/profile/me`, {
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
          
            setUserData(data);
           
            
        } catch (error) {
            console.error('Failed to fetch user data:', error);
            setError('Error fetching user data. Please try again later.');
        }
    };

    useEffect(() => {
        if (userData) {
            console.log("User ID:", userData._id); // Access userData._id here after it’s updated
        }
    }, [userData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditableData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };



    const fetchSuggestions = async (query) => {
        if (query.length >= 2) {
            try {
                const response = await fetch(`/profile/bestfriend/search?username=${query}`);
                const data = await response.json();
                setSuggestions(data.length ? data : []); // Clear suggestions if no data
            } catch (error) {
                console.error('Error fetching user suggestions:', error);
            }
        } else {
            setSuggestions([]);
        }
    };

    const handleBestFriendChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);
        fetchSuggestions(value);
        handleInputChange(e); // Update the form data with the new value
    };

    const handleSuggestionClick = (user) => {
        setEditableData((prevData) => ({
            ...prevData,
            bestFriend: user._id // Correctly updating the state
        }));
        setSearchQuery(user.username); // Show the selected username
        setSuggestions([]); // Hide suggestions
    };
    
    

    const toggleEditMode = () => {
        setIsEditing(!isEditing);
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
                setEditableData((prevData) => ({ ...prevData, profilePic: file }));
            };
            reader.readAsDataURL(file);
        }
    };

    const saveChanges = async () => {
      const formData = new FormData();
  
      // Append all fields to the formData
      formData.append('username', editableData.username);
      formData.append('fullname', editableData.fullname);
      formData.append('relationshipStatus', editableData.relationshipStatus);
      formData.append('bio', editableData.bio);
      formData.append('dateOfBirth', editableData.dateOfBirth);
      formData.append('collegeName', editableData.collegeName);
      formData.append('bestFriend', editableData.bestFriend); 
      formData.append('interests', editableData.interests);
      formData.append('favoriteSports', editableData.favoriteSports);
      formData.append('favoriteGame', editableData.favoriteGame);
      formData.append('favoriteMusic', editableData.favoriteMusic);
      formData.append('favoriteMovie', editableData.favoriteMovie);
      formData.append('favoriteAnime', editableData.favoriteAnime);
      formData.append('favoriteActor', editableData.favoriteActor);
  
      // if (editableData.profilePic instanceof File) {
      //     formData.append('profilePic', editableData.profilePic); // Attach image file
      // }

      if (editableData.profilePic instanceof File) {
        console.log('Profile picture is a file:', editableData.profilePic); // Debug
        formData.append('profilePic', editableData.profilePic); // Attach image file
    } else {
        console.log('Profile picture is not a file:', editableData.profilePic); // Debug
    }
  
      try {
          const response = await axios.patch(`/profile/update`, formData, {
              headers: {
                  'Content-Type': 'multipart/form-data',
                  Authorization: `Bearer ${localStorage.getItem('token')}`, // Pass token for authentication
              },
          });
  
          setUserData(response.data.updatedUser); // Update UI with new user data
          toggleEditMode(); // Exit edit mode
      } catch (error) {
          console.error('Error updating profile:', error);
          setError('Failed to update profile. Please try again later.');
      }
  };

    const fetchUserPosts = async () => {
        try {
          console.log("in fetch user posts");
            const userId = userData._id;
            console.log(userId);
    
            if (userData) {
                const response = await axios.get(`/profile/userPosts/${userId}`);
                
    

               
                setSectionData(response.data.posts || []);
                console.log('section data:',sectionData);
            } else {
                console.log("No user data!");
            }
        } catch (error) {
            console.error('Error fetching user posts:', error);
            setSectionData([]);
        }
    };
    
    // Log sectionData when it updates
    useEffect(() => {
        console.log("Updated sectionData:", sectionData);
    }, [sectionData]);



    const fetchUserLiked = async () => {
        try {
            const userId=userData._id;
            console.log(userId);

            const response = await axios.get(`/profile/likedPosts/${userId}`);
           
            setLikedData(response.data);
        } catch (error) {
            console.error('Error fetching liked posts:', error);
            setLikedData([]);
        }
    };


    async function unlikePost(postId) {
      try {
        const response = await fetch(`/posts/${postId}/unlike`, {
          method: 'PATCH',
          headers: { Authorization: `Bearer ${token}` },
        });
    
        if (response.ok) {
          setLikedData((prevData) => prevData.filter((post) => post._id !== postId));
          toast.success('Post unliked successfully');
        } else {
          const errorData = await response.json();
          toast.error(`Error: ${errorData.message}`);
        }
      } catch (error) {
        console.error('Error unliking post:', error);
        console.log('An error occurred. Please try again.');
      }
    }
    

    useEffect(() => {
        console.log("Updated likedData:", likedData);
    }, [likedData]);

    const deletePost = async (postId) => {
        try {
          
          const token=localStorage.getItem('token');
          const response = await fetch(`/posts/${postId}`, {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${token}`, 
            },
          });
      
          const data = await response.json();
          if (response.ok) {
            toast.success('Post deleted successfully!',{duration:1500});
            setSectionData((prevData) => prevData.filter((post) => post._id !== postId));
      
            
          } else {
            toast.error(data.message,{duration:2500});
          }
        } catch (error) {
          console.error('Error deleting post:', error);
          toast.error('Failed to delete post');
        }
      };
    

    const fetchUserSaved = async () => {
        try {
            
            const userId = userData._id;
           
            if (userData) {
                const response = await axios.get(`/profile/savedPosts/${userId}`);
                
              
                
                setSavedData(response.data || []);
                
            } else {
                console.log("No user data!");
            }
        } catch (error) {
            console.error('Error fetching user posts:', error);
            setSavedData([]);
        }
    };
    
    useEffect(() => {
        console.log("Updated saved Data:");
        

    }, [savedData]);
    
    //added
    // useEffect(()=>{
    
    //   if(activeSection==="posts"){
    //     console.log('entered initial setting posts');
    //     fetchUserPosts();
    //     console.log(activeSection);
    //   }

    // },[activeSection])

    // useEffect(()=>{
    //   console.log("initial state");
    //   console.log(activeSection);
    //   fetchUserPosts();
    // },[])

    // useEffect(()=>{
    //   if(userData && activeSection==="posts")
    //     fetchUserPosts();
    // },[userData])

    const handleSectionChange = (section) => {
        setActiveSection(section);
        if (section === "posts") fetchUserPosts();
        else if (section === "liked") fetchUserLiked();
        else if (section === "saved") fetchUserSaved();
    };

    const goToUserProfile = (id) => {
      
      // id===userData._id?navigate(`/profile`):navigate(`/profile/${id}`);
      navigate(`/profile/${id}`)
    };

    
    if (error) {
        return <div>{error}</div>;
    }

    if (!userData) {
        // return <div>Loading...</div>;
        return <LoadingPage />;
    }



      
    
    return (
        <div className="container">
            <div className="profileCard">
                <div className="profilePicContainer">
                    {isEditing ? (
                        <div>
                            <label htmlFor="profilePicUpload">
                                <img
                                    // src={previewImage || editableData.profilePic || '/images/default_profile.jpeg'}
                                    src={previewImage}
                                    alt="Click to add ProfilePic"
                                    className="profilePic"
                                />
                               
                            </label>
                            <input
                                type="file"
                                id="profilePicUpload"
                                name="profilePic"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={handleImageUpload}
                            />
                            <br />
                            <span>Click image to add a picture</span>
                        </div>
                    ) : (
                        <img
                            src={userData.profilePic === '/images/default_profile.jpeg' ? '/images/default_profile.jpeg' : `${userData.profilePic}`}
                            alt="Profile Pic"
                            className="profilePic"
                        />
                    )}
                </div>
                
                <div className="profileInfo">
                    {isEditing ? (
                        <>
                            <input type="text" name="username" value={editableData.username} onChange={handleInputChange} className="input" placeholder="Username" />
                            <input type="text" name="fullname" value={editableData.fullname} onChange={handleInputChange} className="input" placeholder="Full Name" />
                            <input type="date" name="dateOfBirth" value={editableData.dateOfBirth} onChange={handleInputChange} className="input" placeholder="Date of Birth" />
                            <input type="text" name="collegeName" value={editableData.collegeName} onChange={handleInputChange} className="input" placeholder="College Name" />
                            {/* <input type="text" name="bestFriend" value={editableData.bestFriend} onChange={handleInputChange} style={styles.input} placeholder="Best Friend" /> */}
                            <div style={styles.inputContainer}>
                                    <input
                                        
                                        type="text"
                                        name="bestFriend"
                                        value={searchQuery}
                                        onChange={handleBestFriendChange}
                                        className="input"
                                        placeholder="Type username of your best friend"
                                    />
                                    {suggestions.length > 0 && (
                                        <ul className="bg-black text-white">
                                        {suggestions.map((user) => (
                                            <li key={user._id} onClick={() => handleSuggestionClick(user)} style={{
                                                ...styles.suggestionItem,
                                                ':hover': styles.suggestionItemHover,
                                            }} >
                                            {user.username}
                                            </li>
                                        ))}
                                        </ul>
                                    )}
                                    </div>

                            <input type="text" name="interests" value={editableData.interests} onChange={handleInputChange} className="input" placeholder="Interests" />
                            <input type="text" name="favoriteSports" value={editableData.favoriteSports} onChange={handleInputChange} className="input" placeholder="Favorite Sports" />
                            <input type="text" name="favoriteGame" value={editableData.favoriteGame} onChange={handleInputChange} className="input" placeholder="Favorite Game" />
                            <input type="text" name="favoriteMusic" value={editableData.favoriteMusic} onChange={handleInputChange} className="input" placeholder="Favorite Music" />
                            <input type="text" name="favoriteMovie" value={editableData.favoriteMovie} onChange={handleInputChange} className="input" placeholder="Favorite Movie" />
                            <input type="text" name="favoriteAnime" value={editableData.favoriteAnime} onChange={handleInputChange} className="input" placeholder="Favorite Anime" />
                            <input type="text" name="favoriteActor" value={editableData.favoriteActor} onChange={handleInputChange} className="input" placeholder="Favorite Actor" />
                            <select id="edit-relationship-status" name="relationshipStatus" value={editableData.relationshipStatus} onChange={handleInputChange} className="input">
                                <option value="single">Single</option>
                                <option value="in a relationship">In a Relationship</option>
                                <option value="married">Married</option>
                                <option value="complicated">Complicated</option>
                                <option value="other">Other</option>
                            </select>
                            <textarea name="bio" value={editableData.bio} onChange={handleInputChange} className="textarea" placeholder="Bio" />
                            <button className="saveButton" onClick={saveChanges}>Save Changes</button>
                            <button className="cancelButton" onClick={toggleEditMode}>Cancel</button>
                        </>
                    ) : (
                        <>
                        {console.log("userData")}
                        {console.log(userData)}
                        <div className="profileContainer">
  {/* Username and Full Name */}
                    <h2 className="username">{`@${userData.username}` || "User's Name"}</h2>
            <p className="fullname">{userData.fullname || 'Full Name'}</p>

  {/* Edit Profile Button at Top Right */}
  <button className="editButton topRight" onClick={toggleEditMode}>Edit Profile</button>

  {/* Stats Row */}
  <div className="statsRow">
    <div className="statItem">
      <span className="statCount">{userData.postsCount || 0}</span>
      <span className="statLabel"> Posts</span>
    </div>
    <div className="statItem cursor-pointer" onClick={() => openModal('following')}>
      <span className="statCount">{userData.following.length || 0}</span>
      <span className="statLabel"> Following</span>
    </div>
    <div className="statItem cursor-pointer" onClick={() => openModal('followers')}>
      <span className="statCount">{userData.followers.length || 0}</span>
      <span className="statLabel"> Followers</span>
    </div>
  </div>

  {/* Additional Info */}
  <p className="additionalInfo">Date of Birth: {userData.dateOfBirth ? userData.dateOfBirth.split('T')[0] : 'Not specified'}</p>
  <p className="additionalInfo">College Name: {userData.collegeName || 'Not specified'}</p>
  <p className="additionalInfo">Relationship Status: {userData.relationshipStatus || 'Single'}</p>
  <p className="additionalInfo">Best Friend: {userData.bestFriend?.username || 'Not specified'}</p>
  <p className="additionalInfo">Interests: {userData.interests || 'Not specified'}</p>
  <p className="additionalInfo sport">Favorite Sports: {userData.favoriteSports || 'Not specified'}</p>
  <p className="additionalInfo game">Favorite Game: {userData.favoriteGame || 'Not specified'}</p>
  <p className="additionalInfo music">Favorite Music: {userData.favoriteMusic || 'Not specified'}</p>
  <p className="additionalInfo movie">Favorite Movie: {userData.favoriteMovie || 'Not specified'}</p>
  <p className="additionalInfo anime">Favorite Anime: {userData.favoriteAnime || 'Not specified'}</p>
  <p className="additionalInfo actor">Favorite Actor: {userData.favoriteActor || 'Not specified'}</p>
  <p className="additionalInfo">Bio: {userData.bio || 'User bio goes here...'}</p>

  {/* Follow and Chat Buttons */}
  <div className="actionButtons">
    <button
      className={`followButton ${isFollowing ? 'unfollow' : 'follow'}`}
      onClick={toggleFollow}
    >
      {isFollowing ? 'Unfollow' : 'Follow'}
    </button>
    <button className="chatButton">Chat</button>
  </div>
</div>

                        {isModalOpen && (
  <div className="modalBackdrop">
    <div className="modalContent">
      <h3 className="modalTitle">{modalContent.length > 0 ? 'Users List' : 'No Users Found'}</h3>
      <ul className="modalList">
   
          {modalContent.map(user => (
          <li key={user.userId} className="modalListItem" onClick={()=>{goToUserProfile(user.userId)}}>

           <span className="username">{user.username}</span>
          </li>
        
          ))}
      </ul>
      <button className="closeButton" onClick={closeModal}>
        Close
      </button>
    </div>
  </div>
)}

                      
                      
                      </>
                      
                    )}
                </div>
            </div>

            <div className="buttonContainer">
                <button style={activeSection === 'posts' ? styles.activeButton : styles.inactiveButton} onClick={() => handleSectionChange("posts")}>Posts</button>
                <button style={activeSection === 'saved' ? styles.activeButton : styles.inactiveButton} onClick={() => handleSectionChange("saved")}>Saved</button>
                <button style={activeSection === 'liked' ? styles.activeButton : styles.inactiveButton} onClick={() => handleSectionChange("liked")}>Liked</button>
            </div>
            <div className="sectionContent">
                
                 



<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
  {activeSection === "posts" &&
    sectionData.map((post) => (
      <div
        key={post._id}
        className="relative bg-white rounded-lg shadow-md cursor-pointer overflow-hidden"
        onClick={() => 
          {
            
            setSelectedPost(post)
        } } // Open modal on click
        style={{ aspectRatio: "4 / 3" }} // Ensures consistent dimensions
      >
        {/* Post content */}
        {post.postType === "image" && post.content.mediaUrl && (
          <img
            src={`${post.content.mediaUrl}`}
            alt="Post media"
            className="w-full h-full object-cover"
          />
        )}
        {post.postType === "video" && post.content.mediaUrl && (
          <video className="w-full h-full object-cover" muted>
            <source
              src={`${post.content.mediaUrl}`}
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
        )}
        {post.postType === "text" && (
          <div className="p-4 flex items-center justify-center text-center">
            <p className="text-gray-700">{post.caption}</p>
          </div>
        )}
      </div>
    ))}
</div>


{/* //saved */}

<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
{activeSection === "saved" &&
  savedData.map((post, index) => (
    <div
      key={post._id}
      className="relative bg-white rounded-lg shadow-md cursor-pointer overflow-hidden"
       onClick={() =>{ console.log("clicked post:",post);setSelectedPost(post)}} // Open modal on click
        style={{ aspectRatio: "4 / 3" }}
    >
    {post.postId?.postType === "image" && post.postId?.content.mediaUrl && (
          <img
            src={`${post.postId?.content.mediaUrl}`}
            alt="Post content"
            className="w-full h-full object-cover "
          />
        )}
        {post.postId?.postType === "video" && post.postId?.content.mediaUrl && (
          <video className="w-full h-full object-cover muted">
            <source
              src={`${post.postId?.content.mediaUrl}`}
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
        )}
        {post.postId?.postType === "text" && (
          <div className="p-4 flex items-center justify-center text-center">
            <p className="text-gray-700">{post.postId?.caption}</p>
          </div>
        )}

        
        
      </div>

      
  ))} 
</div>

<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
  {activeSection === "liked" &&
    likedData.map((post) => (
      <div
        key={post._id}
        className="relative bg-white rounded-lg shadow-md cursor-pointer overflow-hidden"
        // Optionally, handle post selection or other actions here
        onClick={() => {console.log("licked post",post);setSelectedPost(post)}} // Open modal on click
        style={{ aspectRatio: "4 / 3" }}
      >
     
      

      
        {post.postType === "image" && post.content.mediaUrl && (
          <img
            src={`${post.content.mediaUrl}`}
            alt="Post content"
            className="w-full h-full object-cover "
          />
        )}
        {post.postType === "video" && post.content.mediaUrl && (
          <video className="w-full h-full object-cover muted">
            <source
              src={`${post.content.mediaUrl}`}
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
        )}
        {post.postType === "text" && (
          <div className="p-4 flex items-center justify-center text-center">
            <p className="text-gray-700">{post.caption}</p>
          </div>
        )}

        
        
      </div>
    ))} 
</div>







{/* Modal for Enlarged Post */}
{selectedPost && (
  <div
    className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
    style={{ paddingTop: "4rem" }} // Ensures the modal stays below the navbar
  >
    <div
      className="bg-white rounded-lg shadow-lg p-4 relative max-w-4xl w-full mx-4"
      style={{
        maxHeight: "90vh", 
        overflow: "auto",
      }}
    >
{/* added */}
<button
  className="absolute top-4 right-12 text-gray-500 hover:text-gray-700"
  onClick={() => {
    if (activeSection === "posts") {
      deletePost(selectedPost._id);
      setSelectedPost(null);
    } else if (activeSection === "liked") {
      unlikePost(selectedPost._id);
      setSelectedPost(null);
    } else if (activeSection === "saved") {
      handleUnsavePost(selectedPost._id);
      setSelectedPost(null);
    }
    setSelectedPost(null); // Close modal
  }}
>
  {activeSection === "posts" && <Trash size={16} color="red" />}
  {activeSection === "liked" && <HeartOff size={16} color="blue" />} {/* Unlike icon */}
  {activeSection === "saved" && <BookmarkMinus size={16} color="green" />} {/* Unsave icon */}
</button>
{/* added */}

      <button
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        onClick={() => setSelectedPost(null)} // Close modal
      >
        ✖
      </button>
      {/* Enlarged content */}
      <div className="flex flex-col">
        {/* User Info (Side-by-Side) */}
        <div className="flex items-center mb-4">
        
          

            <img
  src={
    activeSection === "liked" || activeSection === "posts"
      ? selectedPost.user.profilePic === "/images/default_profile.jpeg"
        ? selectedPost.user.profilePic // Use the default profile pic as is
        : `${selectedPost.user.profilePic}`
      : activeSection === "saved"
      ? selectedPost.postId.user.profilePic === "/images/default_profile.jpeg"
        ? selectedPost.postId?.user.profilePic // Use the default profile pic as is
        : `${selectedPost.postId.user.profilePic}`
      : "/default_profile_pic.jpeg" // Fallback if no section matches
  }
  alt="Profile"
  className="w-10 h-10 rounded-md mr-3"
/>



          <strong className="text-lg text-gray-800">
            {activeSection==="saved"?selectedPost.postId.user.username:selectedPost.user.username}
          </strong>
        </div>

        

{activeSection !== "saved" ? (
  // For "liked" and "posts"
  <>




    {selectedPost.caption && (
      <p className="text-gray-700 mb-4 text-left">{selectedPost.caption}</p>
    )}

  
     <div className="flex justify-center items-center">
      {selectedPost.content.mediaUrl && selectedPost.postType === "image" && (
        <img
          src={`${selectedPost.content.mediaUrl}`}
          alt="Post content"
          className="max-w-full max-h-[75vh] object-contain rounded-lg"
        />
      )}
      {selectedPost.content.mediaUrl && selectedPost.postType === "video" && (
        <video
          controls
          className="w-full h-auto max-w-full max-h-[75vh] object-contain rounded-lg"
        >
          <source
            type="video/mp4"
            src={`${selectedPost.content.mediaUrl}`}
          />
          Your browser does not support the video tag.
        </video>
      )}
    </div> 
  </>
) : (
  // For "saved"
  <>
    {selectedPost.postId.caption && (
      <p className="text-gray-700 mb-4 text-left">
        {selectedPost.postId.caption}
      </p>
    )}

    {/* Post Media */}
    <div className="flex justify-center items-center">
      {selectedPost.postId.content.mediaUrl &&
        selectedPost.postId.postType === "image" && (
          <img
            src={`${selectedPost.postId.content.mediaUrl}`}
            alt="Post content"
            className="max-w-full max-h-[75vh] object-contain rounded-lg"
          />
        )}
      {selectedPost.postId.content.mediaUrl &&
        selectedPost.postId.postType === "video" && (
          <video
            controls
            className="w-full h-auto max-w-full max-h-[75vh] object-contain rounded-lg"
          >
            <source
              type="video/mp4"
              src={`${selectedPost.postId.content.mediaUrl}`}
            />
            Your browser does not support the video tag.
          </video>
        )}
    </div>
  </>
)}




      </div>
    </div>
  </div>
)}



            

           


  





            </div>
        </div>
    );
}


 const styles = {
//     
    activeButton: {
        padding: '12px 25px',
        backgroundColor: '#28a745',
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '1.2em',
    },
    inactiveButton: {
        padding: '12px 25px',
        backgroundColor: 'transparent',
        color: '#333',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '1.2em',
    },
//     
};
export default UserDetails;
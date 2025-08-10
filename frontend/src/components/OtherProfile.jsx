import React from "react";
import {useState,useEffect,useRef} from "react";
import {useNavigate} from "react-router-dom";
import { useParams } from 'react-router-dom';
import axios from "axios";
import "./OtherProfile.css"; // Assuming CSS styles are in this file
import { useSocket } from "./useSocket";
import { FiLogOut } from "react-icons/fi";
import Quote from "./Quote";
import { useChatStore } from "./useChatStore";

const Profile = () => {

    // const { userId } = useParams(); // Get userId from the URL
  
    const [userData, setUserData] = useState(null);
    const [currentUserId,setCurrentUserId]=useState();
    const [userPosts, setUserPosts] = useState([]);
    const [savedPosts, setSavedPosts] = useState([]);
    const [likedPosts,setLikedPosts]=useState([]);
    const [selectedPost, setSelectedPost] = useState(null);
    const [activeTab, setActiveTab] = useState();
    const [friends,setFriends]=useState([]);
    const [connectionStatus, setConnectionStatus] = useState(null);
    const [mutualFriendsCount, setMutualFriendsCount] = useState(0);
    const [isFollowing, setIsFollowing] = useState(false);
    const [loading, setLoading] = useState(false); // For button loading state
    const {onlineUsers} =useSocket();   
    const {profileId, setProfileId, chatUserId, setChatUserId}=useChatStore();
    // const userId=profileId;
    
    
  
    const renderurl="https://socialmedia-backend-2njs.onrender.com";

    const navigate=useNavigate();
    const backendBaseUrl="http://localhost:7000";

    const token = localStorage.getItem("token");

    const fetchuserId= async ()=>{
        try{
          const token = localStorage.getItem("token");
          if(!token){
            alert("No token bro!")
            return;
          }
          
          // Decode the JWT token to get the userId
          const payload = parseJwt(token);
          if (!payload || !payload.userId) {
              alert("User not authenticated. Please log in again.");
              return;
          }
      
            setCurrentUserId(payload.userId);
            console.log("payload.userId");
            console.log(payload.userId);
            console.log("currentuserId");
            console.log(currentUserId);
        }
        catch(e){
          console.log(e);
        }
      }

      const parseJwt = (token) => {
        try {
            if(!token)
            {
              alert("error here");
              return;

            }
            const base64Url = token.split(".")[1];
            const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
            return JSON.parse(window.atob(base64));
        } catch (error) {
            console.error("Invalid token format");
            return null;
        }
    };

    useEffect(()=>{
      console.log("target user uid",profileId);
      
      fetchuserId();
      },[currentUserId])

useEffect(()=>{
  console.log("come on!");
  console.log(profileId);
},[profileId]);

      const handleChat = (profileId) => {

        if(profileId){
          
          setChatUserId(profileId);
          navigate("/chats");
        }
    
      };


      // useEffect(()=>{
      //   if(chatUserId){
      //     navigate('/chats');
      //   }
      // },[chatUserId]);

      useEffect(() => {
        // Fetch user data by userId
        if(profileId && profileId !== undefined){
          console.log("useriod from fetching-",profileId);
          axios.get(`/user/viewProfile/${profileId}`)
              .then((response) => {
                console.log("userdata");
                console.log(response.data);
                  setUserData(response.data);
              })
              .catch((error) => {
                  console.error('Error fetching user data:', error);
              });
        }
 }, [profileId]);


 const checkConnection = async () => {
    try {
      if(!currentUserId || !profileId){
        alert("error here");
        return;
      }
      const response = await axios.get(`/profile/check-connection/${currentUserId}/${profileId}`);
      setConnectionStatus(response.data);
    } catch (error) {
      console.error('Error checking connection:', error);
    }
  };


 

const fetchMutualFriends = async () => {
  try {
    if (profileId && currentUserId) {
      const response = await axios.get(`/profile/mutual-friends/${currentUserId}/${profileId}`);
      setMutualFriendsCount(response.data.mutualFriendsCount);
    }
  } catch (error) {
    console.error("Error fetching mutual friends:", error);
  }
};


async function getFriendsDetails(profileId) {
    try {
      console.log("before");
      const response = await fetch(`http://localhost:7000/profile/getfriends/${profileId}`);
      console.log("after");
      console.log(response);
      if (!response.ok) {
        throw new Error('Failed to fetch friends');
      }
  
      const friends = await response.json(); // Parse the JSON response
      console.log("friends");
      console.log(friends);
      setFriends(friends);
      // return friends; // Return the friends data
    } catch (error) {
      console.error('Error fetching friends:', error.message);
      return []; // Return an empty array in case of an error
    }
  }


 useEffect(() => {
   // Fetch connection status
 
   if(profileId && currentUserId)
    {

      checkConnection();
      fetchMutualFriends();
      getFriendsDetails(profileId);
      fetchFollowStatus();
    }
 }, [currentUserId, profileId]);


   // Fetch initial follow status
   const fetchFollowStatus = async () => {
    if(profileId && currentUserId){

      try {
      const response = await axios.get(
        `/profile/isFollowing/${profileId}/${currentUserId}`);
        
        console.log("follow status");
        console.log(response.data.isFollowing);
        setIsFollowing(response.data.isFollowing); // Assuming API returns { isFollowing: true/false }
      } catch (error) {
        console.error("Error fetching follow status:", error);
      }
    }
    };
    
    // Toggle Follow/Unfollow
    const handleFollowToggle = async () => {
        setLoading(true); // Show loading indicator on button
        try {
          if (isFollowing) {
            // Unfollow API call
            console.log('calling unfollow route');
            await axios.post(
              `/profile/unfollow/${profileId}/${currentUserId}`);
          } else {
            // Follow API call
            console.log("calling follow route ! ");
            await axios.post(`/profile/follow/${profileId}/${currentUserId}`);
            console.log("success");


          }
          setIsFollowing(!isFollowing); // Toggle follow status locally
        } catch (error) {
          console.error("Error toggling follow status:", error);
        } finally {
          setLoading(false); // Hide loading indicator
          checkConnection();
          fetchMutualFriends();
          getFriendsDetails(profileId);
        }
      };

      const goToHome = () => {
        setProfileId(null);
        navigate("/home"); // Replace "/home" with your actual home page route
      };

      const handleNavigationToPosts = (profileId)=>{
        navigate('/viewposts');
      }
     

    if (!userData) return <Quote />;

  return (
    <>

  <button className="modern-back-button" onClick={goToHome}>
        <span className="arrow">
          
        <FiLogOut size={25}   style={{ transform: 'scaleX(-1)' }}/>
          </span> 
      </button>
      

    <div className="profile-container">
      <div className="profile-header">
        <span>Name of the User:{userData?.username}</span>
        <span>University name: {userData?.collegeName}</span>
      </div>

      <div className="profile-body">
        <div className="left-section">
          {/* <div className="profile-photo">Profile Photo</div> */}

        {/* //from    */}
          {/* <div className="profile-photo"> */}
            {/* <img src={userData?.profilePic} alt="profilepic" /> */}
              {/* <img
                src={
                  userData?.profilePic === "/images/default_profile.jpeg"
                    ? "/images/default_profile.jpeg"
                    : `${userData?.profilePic}`
                }
                alt="User Profile Picture" */}
                {/* // className="cursor-pointer w-full h-48 object-cover rounded-md"
                // style={profilePicStyle}
               
              /> */}

              {/* Online indicator */}
              {/* {onlineUsers && Array.isArray(onlineUsers) && onlineUsers.includes(userId) && (
                <span className="absolute top-0 right-0 w-3 h-3 bg-green-500 rounded-full ring-2 ring-zinc-900" />
              )} */}
            {/* upto here */}
          {/* </div> */}

          <div className="profile-photo relative">
  {/* Online indicator */}
  {onlineUsers && Array.isArray(onlineUsers) && profileId && onlineUsers.includes(profileId) && (
    <div className="absolute top-0 left-0 flex items-center gap-1 bg-black bg-opacity-70 px-2 py-1 rounded-br-md">
      <span className="w-3 h-3 bg-green-500 rounded-full" />
      <span className="text-white text-sm">Online</span>
    </div>
  )}

  {/* Profile picture */}
  <img
    src={
      userData?.profilePic === "/images/squarepfp.png"
        ? "/images/squarepfp.png"
        : `${userData?.profilePic}`
    }
    alt="User Profile Picture"
   
  />
</div>



            
          {/* <button className="edit-profile" onClick={editProfile}>Edit Profile</button> */}
          <div className="view-div">
            <button className="view-posts" onClick={()=>{handleNavigationToPosts(profileId)}}>View {userData?.username} Posts</button>
          </div>
          
          <div className="actions">
            {/* <button className="follow-btn">Follow</button> */}

            <button
                onClick={handleFollowToggle}
                disabled={loading} // Disable button while loading
                className={`follow-button ${isFollowing ? "unfollow" : "follow"}`} // Add dynamic classes for styling
                >
                {loading ? "Processing..." : isFollowing ? "Unfollow" : "Follow"}
            </button>

            <button className="chat-btn" onClick={()=>{handleChat(profileId)}}>Chat</button>
          </div>
          <div className="connection-info">
            <p>Connection</p>
            {connectionStatus ? (
                connectionStatus.connection ? (
                <p>You have a connection with this user</p>
                ) : (
                <p>You do not have a connection with this user</p>
                )
            ) : (
                <p>Loading connection status...</p>
            )}
          </div>
          <div className="mutual-friends">
            <p>Mutual Friends</p>
            <p>You have {mutualFriendsCount} common friends with {userData?.username}</p>
          </div>
          <div className="contact-info">
            <h4>Contact info:</h4>
            <table>
                <tbody>
                    <tr>
                        <td>Email: {userData?.email}</td>
                    </tr>
                    <tr>
                        <td>Mobile Number: {userData?.mobileNumber}</td>
                    </tr>
                    <tr>
                        <td>Website: {userData?.website}</td>
                    </tr>
                </tbody>
            </table>
           
          </div>
          {/* <table>
            <tbody>
              <tr>
                <td><div className="friends">
                    <p>Friends:</p>
                  </td>
              </tr>
              <tr>

                <td>
                <div className="friend-list">
            {friends.map((friend) => (
              <div key={friend._id} className="friend-item">
                <img
                  src={friend.profilePic}
                  alt={`${friend.username}'s profile`}
                  className="friend-profile-pic"
                />
                <p className="friend-username">{friend.username}</p>
              </div>
            ))}
          </div>
                </td>

              </tr>

            </tbody>
          
          
        </div>
          </table> */}

<table>
  <tbody>
    <tr>
      <td>
        <div className="friends">
          <p>Friends:</p>
        </div>
      </td>
    </tr>
    <tr>
      <td>
        <div className="friend-list">
          {friends.map((friend) => (
            <div key={friend._id} className="friend-item">
              <img
                src={friend.profilePic}
                alt={`${friend.username}'s profile`}
                className="friend-profile-pic"
              />
              <p className="friend-username">{friend.username}</p>
            </div>
          ))}
        </div>
      </td>
    </tr>
  </tbody>
</table>

          
        </div>

        <div className="center-section">
          <h3>Information</h3>
          <div className="info-table">
            <h4>Account Info</h4>
            <table>
              <tbody>
                <tr>
                  <td>Name: {userData?.fullname}</td>
                </tr>
                <tr>
                  <td>Member Since:{userData?.createdAt?.split('T')[0]}</td>
                </tr>
                <tr>
                  <td>Last Update:{userData?.updatedAt?.split('T')[0]}</td>
                </tr>
              </tbody>
            </table>

            <h4>Basic Info</h4>
            <table>
              <tbody>
                <tr>
                  <td>School: {userData?.school}</td>
                </tr>
                <tr>
                  <td>Status: {userData?.status}</td>
                </tr>
                <tr>
                  <td>Gender:{userData?.gender}</td>
                </tr>
                <tr>
                  <td>Residence: {userData?.residence}</td>
                </tr>
                <tr>
                  <td>Birthday:{userData?.dateOfBirth?.split('T')[0]}</td>
                </tr>
                <tr>
                  <td>Home Town:{userData?.hometown}</td>
                </tr>
                <tr>
                  <td>High School: {userData?.highschool}</td>
                </tr>
              </tbody>
            </table>

            <h4>Personal Info</h4>
            <table>
              <tbody>
                <tr>
                  <td>Looking for: {userData?.lookingfor}</td>
                </tr>
                <tr>
                  <td>Interested In: {userData?.interestedIn}</td>
                </tr>
                <tr>
                  <td>Relationship Status: {userData?.relationshipStatus}</td>
                </tr>
                <tr>
                  <td>Best Friend: {userData?.bestFriend?.username}</td>
                  {/* <td>Best Friend: {"later!"}</td> */}
                </tr>
                <tr>
                  <td>College Name: {userData?.collegeName}</td>
                </tr>
              </tbody>
            </table>

            <h4>Interest</h4>
            <table>
              <tbody>
                <tr>
                  <td>Interests: {userData?.interests}</td>
                </tr>
                <tr>
                  <td>Favorite Sports: {userData?.favoriteSport}</td>
                </tr>
                <tr>
                  <td>Favorite Game: {userData?.favoriteGame}</td>
                </tr>
                <tr>
                  <td>Favorite Music:{userData?.favoriteMusic}</td>
                </tr>
                <tr>
                  <td>Favorite Movie:{userData?.favoriteMovie}</td>
                </tr>
                <tr>
                  <td>Favorite Anime: {userData?.favoriteAnime}</td>
                </tr>
                <tr>
                  <td>Favorite Actor:{userData?.favoriteActor}</td>
                </tr>
                <tr>
                  <td>About me (Bio): {userData?.bio}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="right-section">
          {/* <p>Leave this space</p> */}
        </div>
      </div>
    </div>

    </>
  );
};

export default Profile;
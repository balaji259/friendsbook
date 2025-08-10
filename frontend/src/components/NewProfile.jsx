import React from "react";
import {useState,useEffect,useRef, useContext} from "react";
import {useNavigate} from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import Quote from "./Quote";
import { ChartNoAxesColumnDecreasing } from "lucide-react";
import {AuthContext} from "./AuthContext";
import api from "../api/api";
// import "./NewProfile.css";


const Profile = () => {

  const [userData, setUserData] = useState(null);
    const [sectionData, setSectionData] = useState([]);
    const [savedData, setSavedData] = useState([]);
    const [likedData,setLikedData]=useState([]);
   
    const [friends,setFriends]=useState([]);


  const [activeSection, setActiveSection] = useState("posts");
    const [error, setError] = useState(null);
    const [friendSuggestions, setFriendSuggestions] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editableData, setEditableData] = useState({});
    const [previewImage, setPreviewImage] = useState(null);const [suggestions, setSuggestions] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    const [selectedPost, setSelectedPost] = useState(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState([]);

    const {token, authuser} = useContext(AuthContext);

    const navigate=useNavigate();
    const buttonRef = useRef(null);


const fetchUserData = async () => {
  try {

    if (!token) {
      alert('You are not logged in. Please log in to view your profile.');
      
      return;
    }

    const response = await api.get('/profile/me', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

  
    console.log('User data:', response.data);
    setUserData(response.data);

  } catch (error) {
    console.error('Failed to fetch user data:', error.message);
    setError('Error fetching user data. Please try again later.');
  }
};


  async function getFriendsDetails(userId) {
    try {
      console.log("before");
      const response = await api.get(`/profile/getfriends/${userId}`);
      console.log("after");
      console.log(response);
 
      
      setFriends(response.data);
      // return friends; // Return the friends data
    } catch (error) {
      console.error('Error fetching friends:', error.message);
      return []; // Return an empty array in case of an error
    }
  }

  //fetching user data ....
    useEffect(() => {
      fetchUserData();
     
  }, []);

  let formattedDateofBirth;
  useEffect(() => {
    if (userData) {

       

        setEditableData({
            username: userData.username || '',
            fullname: userData.fullname || '',
            email:userData.email || '',

            relationshipStatus: userData.relationshipStatus,
            bio: userData.bio,
            profilePic: userData.profilePic,
            dateOfBirth: userData.dateOfBirth|| '',
            // dateOfBirth:convertToDateOfBirth(userData.dateOfBirth) || '',
            collegeName: userData.collegeName || '',
            bestFriend: userData.bestFriend || '',
            interests: userData.interests || '',
            gender:userData.gender || '',
            favoriteSports: userData.favoriteSports || '',
            favoriteGame: userData.favoriteGame || '',
            favoriteMusic: userData.favoriteMusic || '',
            favoriteMovie: userData.favoriteMovie || '',
            favoriteAnime: userData.favoriteAnime || '',
            favoriteActor: userData.favoriteActor || '',
            highschool:userData.highschool || '',
            hometown:userData.hometown || '',
            interestedin:userData.interestedIn || '',
            lookingfor:userData.lookingfor || '',
            residence:userData.residence || '',
            school:userData.school || '',
            status:userData.status || '',
            website:userData.website || '',
            mobileNumber:userData.mobileNumber || '',

        });
      
    }
}, [userData]);

useEffect(() => {
  if (userData) {
      console.log("User ID:", userData._id);
      console.log("userdata");
      console.log(userData);
      console.log("calling frineds function");
      getFriendsDetails(userData._id);

  }
}, [userData]);




const editProfile=()=>{
    navigate("/edit");
}

const goToPosts=()=>{
  navigate("/newposts");
}

const goToHome = () => {
  navigate("/home"); // Replace "/home" with your actual home page route
};


const convertToDateOfBirth = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};





if (!userData) {
  return <Quote />;
  // return <LoadingPage />;
}








  return (

    
    
    <>
    
    

    
    <button className="modern-back-button" onClick={goToHome}>
        <span className="arrow">
          
        <FiLogOut size={25}   style={{ transform: 'scaleX(-1)' }}/>
          </span> 
      </button>
      




<div className="profile-container">

      <div className="profile-header">
        <span>Username:{userData?.username}</span>
        <span>University name: {userData?.collegeName}</span>
      </div>

      <div className="profile-body">
        <div className="left-section">
          {/* <div className="profile-photo">Profile Photo</div> */}
          <div className="profile-photo">
            <img src={userData?.profilePic} alt="profilepic" />
          </div>
          
          <div className="my-profile-buttons">
            <button className="edit-profile" onClick={editProfile}>Edit Profile</button>
            <button className="view-my-posts" onClick={goToPosts}>View Posts</button>
          </div>

          {/* <div className="actions">
            <button className="follow-btn">Follow</button>
            <button className="chat-btn">Chat</button>
          </div> */}
          {/* <div className="connection-info">
            <p>Connection</p>
            <p>You have a connection with username</p>
          </div>
          <div className="mutual-friends">
          <p>Mutual Friends</p>
            <p>You have 19 common friends with username</p>
          </div> */}
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
                src={friend?.profilePic}
                alt={`${friend?.username}'s profile`}
                className="friend-profile-pic"
              />
              <p className="friend-username">{friend?.username}</p>
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
                  <td>Full Name: {userData?.fullname}</td>
                </tr>
                <tr>
                  <td>Member Since:{userData?.createdAt?.split('T')[0]}</td>
                </tr>
                <tr>
                  <td>Last Updated:{userData?.updatedAt?.split('T')[0]}</td>
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
                  <td>Gender:{userData?.gender || '-'}</td>
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
                {/* <tr>
                  <td>Best Friend: {userData?.bestFriend?.username}</td>
                  
                </tr> */}


                {/* <tr>
                  <td>Best Friends:</td>
                  <td>
                    {userData?.bestFriend && userData.bestFriend.length > 0 ? (
                      userData.bestFriend.map((friend,index) => <span key={friend._id}>{friend.username}, </span>)
                    ) : (
                      <span>No best friends selected</span>
                    )}
                  </td>
                </tr> */}

<tr>
  <td>Best Friends:
  {/* <td> */}
    {userData?.bestFriend && userData.bestFriend?.length > 0 ? (
      userData.bestFriend.map((friend, index) => (
        <span key={friend._id}>
          {friend.username}
          {index !== userData.bestFriend?.length - 1 && ", "}
        </span>
      ))
    ) : (
      <span>No best friends selected</span>
    )}
  </td>
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
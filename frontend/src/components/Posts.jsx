import React, { useState, useEffect, useRef, useContext } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
import './scroll.css';
import {useSocket} from "./useSocket";
import { useChatStore } from './useChatStore';
import api from "../api/api";
import { AuthContext } from "./AuthContext";


// Define all styles at the top
const postComponentContainerStyle = {
  marginTop: '15px',
  // padding: '20px',
  width:'100%',
  backgroundColor: '#d5d5d5',
  // maxHeight: '80vh',
  overflowY: 'scroll',
  
  border:'none'
  
};



const postInputContainerStyle = {
  backgroundColor: '#fff',
  padding: '10px',
  borderRadius: '5px',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
  border:'2px solid black',
  marginTop:'15px'
};

const textareaStyle = {
  width: '100%',
  height: '60px',
  padding: '10px',
  borderRadius: '5px',
  border:'1px solid grey',
  borderColor: '#ddd',
  resize: 'none',
};

const removeButtonStyle = {
  position: 'absolute',
  top: '5px',
  right: '5px',
  backgroundColor: '#ff4d4d',
  color: '#fff',
  border: 'none',
  borderRadius: '3px',
  padding: '5px 10px',
  cursor: 'pointer',
  fontSize: '12px',
};

// const submitButtonStyle = {
//   backgroundColor: '#007bff',
//   // backgroundColor:'#e5e5e5e',
//   color: '#fff',
//   padding: '8px 15px',
//   border: 'none',
//   borderRadius:'5px',
//   cursor: 'pointer',
//   marginTop: '10px',
//   // position:'relative',
//   // right:'-180px'
// };


// const hiddenFileInputStyle = {
//   position: 'absolute',
//   left: '0',
//   top: '0',
//   width: '100%',
//   height: '100%',
//   opacity: 0,
//   zIndex: -1,
// };

// const customUploadButtonStyle = {
//   backgroundColor: '#007bff',
//   color: '#fff',
//   padding: '8px 15px',
//   border: 'none',
//   borderRadius: '5px',
//   cursor: 'pointer',
//   fontSize: '14px',
// };

const submitButtonStyle = {
  backgroundColor: '#3b5998',
  color: '#fff',
  padding: '10px 20px', // Ensure uniform padding
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontSize: '14px', // Match the font size
  display: 'flex', // Align content for consistent appearance
  alignItems: 'center',
  justifyContent: 'center',
};

const customUploadButtonStyle = {
  backgroundColor: '#3b5998',
  color: '#fff',
  padding: '10px 20px', // Same padding as the submit button
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontSize: '14px', // Match the font size
  display: 'flex', // Align content for consistency
  alignItems: 'center',
  justifyContent: 'center',
};

const hiddenFileInputStyle = {
  position: 'absolute',
  left: '0',
  top: '0',
  width: '100%',
  height: '100%',
  opacity: 0,
  zIndex: -1,
};


const userPostStyle = {
  backgroundColor: '#ffffff',
  padding: '30px',
  marginBottom: '20px',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  // border: '2px solid black'
  overflow:"hidden",
  position:"relative"
};

const postHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '10px',
  // position: 'relative'
};

const userInfoStyle = {
  display: 'flex',
  // alignItems: 'center',
  alignItems: 'flex-start',
  cursor:"pointer",
  flexWrap:"noWrap",
  gap:"10px",
  overflow:"hidden"


};

const profilePicStyle = {
  width: '50px',
  height: '50px',
  borderRadius: '5px',
  marginRight: '8px',
  // border:'4px solid grey'
};

const usernameStyle = {
  fontWeight: 'bold',
  marginLeft:'4px',
  marginTop:'8px'
};

const toggleButtonStyle = {
  background: 'none',
  border: 'none',
  fontSize: '24px',
  cursor: 'pointer',
  marginLeft:"8px"
};

// const dropdownMenuStyle = {
//   position: 'absolute',
//   right: '20px',
//   top: '20px', // Position the dropdown below the three dots
//   backgroundColor: '#333',
//   color: '#fff',
//   borderRadius: '4px',
//   padding: '8px 0',
//   boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
//   zIndex: 1
// };

// const dropdownMenuStyle = {
//   position: 'absolute',
//   right: '25px',
//   top: '25px', // Position the dropdown below the three dots
//   backgroundColor: '#333',
//   color: '#fff',
//   borderRadius: '4px',
//   padding: '8px 0',
//   boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
//   zIndex: 1
// };

const dropdownMenuStyle = {
  position: 'absolute',
  right: '0', // Align the dropdown beside the toggle button
  top: '0', // Align it vertically with the toggle button
  transform: 'translateX(calc(-100% + 40px))', // Add spacing between the toggle and dropdown
  backgroundColor: '#333',
  color: '#fff',
  borderRadius: '4px',
  padding: '8px 0',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  zIndex: 10,
};


const menuItemStyle = {
  padding: '8px 16px',
  cursor: 'pointer',
};

menuItemStyle[':hover'] = { backgroundColor: '#444' };

// const postMediaStyle = {
//   width: '100%',
//   // maxHeight: '400px',
//   borderRadius: '8px',
//   marginTop: '10px',
// };

const postMediaStyle = {
  width:'100%',
  height:'auto',
  // maxWidth:'300px',
  maxHeight:'400px',
  marginTop:'10px',
  borderRadius:'8px',
  objectFit:'contain'
};




const postFooterStyle = {
  display: 'flex',
  justifyContent: 'space-around',
  marginTop: '25px',
  marginBottom:'0px'
};

const postButtonStyle = {
  background: 'none',
  border: 'none',
  fontSize: '16px',
  cursor: 'pointer',
  color: '#007bff',
};

const commentsSectionStyle = {
  marginTop: '10px',
};

const commentStyle = {
  padding: '5px 0',
  borderTop: '1px solid #e0e0e0',
  fontSize: '14px',
};

const menuStyle = {
  position: 'absolute',
  top: '100%',
  right: '0',
  backgroundColor: '#fff',
  border: '1px solid #ddd',
  borderRadius: '5px',
  boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
  zIndex: 1,
};


const userDetailsStyle = {
  display: "flex",
  flexDirection: "column", // Ensures bio appears above the username
  // maxWidth:"100%",
  flex:"1",
  // minWidth:"0",
  overflow:"hidden",
};

const bioStyle = {
  fontSize: "12px", // Smaller font size for the bio
  color: "#555", // Gray color for bio text
  whiteSpace: "nowrap", // Keeps the bio on a single line
  overflow: "hidden", // Hides overflowing text
  textOverflow: "ellipsis", // Adds "..." to indicate truncated text
  maxWidth: "100%",
  marginBottom: "4px",
  marginLeft:"4px" // Spacing between bio and username
};



const RecursiveReplies = ({
  replies,
  toggleCommentLike,
  toggleReplyInput,
  replyingTo,
  handleReplyChange,
  handleAddReply,
  replyTexts,
}) => {
  return replies.map((reply) => (
    <div key={reply.replyId} style={{ marginLeft: "20px", borderLeft: "1px solid #ddd", paddingLeft: "10px" }}>
      <strong>{reply.user?.username || "Anonymous"}:</strong> {reply.text}
      <div>
        <button onClick={() => toggleCommentLike(reply.replyId)}>Like</button>
        <button onClick={() => toggleReplyInput(reply.replyId)}>Reply</button>
      </div>

      {/* Reply input for each reply */}
      {replyingTo[reply.replyId] && (
        <div style={{ marginLeft: "20px" }}>
          <textarea
            placeholder="Write a reply..."
            value={replyTexts[reply.replyId] || ""}
            onChange={(e) => handleReplyChange(reply.replyId, e.target.value)}
            style={{ width: "90%", margin: "5px 0" }}
          />
          <button onClick={() => handleAddReply(reply.replyId)}>Reply</button>
        </div>
      )}

      {/* Recursive rendering of replies */}
      {reply.replies && reply.replies.length > 0 && (
        <RecursiveReplies
          replies={reply.replies}
          toggleCommentLike={toggleCommentLike}
          toggleReplyInput={toggleReplyInput}
          replyingTo={replyingTo}
          handleReplyChange={handleReplyChange}
          handleAddReply={handleAddReply}
          replyTexts={replyTexts}
        />
      )}
    </div>
  ));
};





const PostComponent = () => {
  const fileInputRef= useRef(null);
  const navigate = useNavigate();

   const { token, authuser } = useContext(AuthContext);
    

  const [posts, setPosts] = useState([]);
  const [postContent, setPostContent] = useState(null);
  const [mediaContent, setMediaContent] = useState(null);
  const [showMenus, setShowMenus] = useState({});
  const [newComment, setNewComment] = useState('');
  const [openComments, setOpenComments] = useState({});
  const [replyingTo, setReplyingTo] = useState({}); // Tracks which comment's reply input is open
  const [replyTexts, setReplyTexts] = useState({}); // Stores reply text for each comment
  const [currentuserId,setcurrentuserId]=useState({});
  const {onlineUsers} =useSocket();
  const [isPosting,setIsPosting]=useState(false);
  const {profileId, setProfileId} =useChatStore();

  const [editingCommentId, setEditingCommentId] = useState(null); // Stores the comment being edited
  const [editText, setEditText] = useState(""); // Stores the updated text
  const [editingReplyId, setEditingReplyId] = useState(null);







 const fetchPosts = async () => {
  if (!token) {
    alert("No Token");
    return;
  }

  try {
    const response = await api.get(`/posts/get`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log("setting posts!");
    console.log(response.data);

    setPosts(response.data);
    setMediaContent(null); // added
    setPostContent(null);  // added

  } catch (error) {
    console.error("Error fetching posts:", error);
    alert(error.message || "Failed to fetch posts");
  }
};

  const fetchuserId= async ()=>{
    try{
   

      // Decode the JWT token to get the userId
      const payload = parseJwt(token);
      if (!payload || !payload.userId) {
          alert("User not authenticated. Please log in again.");
          return;
      }
  
        setcurrentuserId(payload.userId);
      
    }
    catch(e){
      console.log(e);
    }
  }


  useEffect(() => {
    fetchPosts();
    fetchuserId();
    
  }, []);

  

  const handleSubmit = async (e) => {
    // setIsPosting(true);
    e.preventDefault();

    setIsPosting(true); // Ensure state change

    console.log("Posting state:", isPosting); // Debugging

   

    if (!token) {
        alert("No token found. Please log in again.");
        return;
    }

    if (!postContent?.trim() && !mediaContent) {
        toast.error("Post cannot be empty!");
        return;
    }

    // Decode userId from token in parallel
    const decodeUserId = new Promise((resolve, reject) => {
        try {
            const base64Url = token.split(".")[1];
            const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split("")
                    .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                    .join("")
            );
            resolve(JSON.parse(jsonPayload).userId);
        } catch (error) {
            reject(error);
        }
    });

    let mediaUrl = null;

    // Upload media to Cloudinary in parallel (if media exists)
    const uploadMedia = mediaContent
        ? fetch("https://api.cloudinary.com/v1_1/dhtk7vhyv/upload", {
              method: "POST",
              body: (() => {
                  const cloudinaryData = new FormData();
                  cloudinaryData.append("file", mediaContent);
                  cloudinaryData.append("upload_preset", "simpleunsigned");
                  return cloudinaryData;
              })(),
          })
              .then((res) => (res.ok ? res.json() : Promise.reject("Cloudinary upload failed")))
              .then((data) => data.secure_url)
              .catch((error) => {
                  console.error("Media upload error:", error);
                  toast.error("Failed to upload media. Please try again.");
                  throw error;
              })
        : Promise.resolve(null);

    try {
        const [userId, uploadedMediaUrl] = await Promise.all([decodeUserId, uploadMedia]);
        mediaUrl = uploadedMediaUrl;

        // Prepare formData
        const formData = new FormData();
        formData.append("userId", userId);
        if (postContent?.trim()) formData.append("captionOrText", postContent.trim());
        if (mediaUrl) formData.append("mediaContent", mediaUrl);

        // Send to backend
       const response = await api.post(
        `/posts/create`,
        formData,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
        }
    );
          
                  setPostContent(null);
                  setMediaContent(null);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                  toast.success("Post created successfully");
                  await fetchPosts(); 


    } catch (error) {
        console.error("Error submitting form:", error);
        toast.error("Error in creating post. Please try again.");
    }
    finally{
      // setIsPosting(false);
      setIsPosting(false); // Ensure it always resets
    }
};



  


  const handleLikeToggle = async (postId,postCreatorId) => {

  
    if (!token) {
      alert("No token found. Please log in again.");
      return;
    }
  
  
    
    try {
  // ✅ Like/Unlike post
  const likeResponse = await api.post(
    `/posts/like/${authuser.userId}/${postId}`,
    {}, // No request body needed here
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );

  const data = likeResponse.data; // Axios automatically parses JSON
  console.log("likeddataresponse", data);

  // Update state with new like status
  setPosts((prevPosts) =>
    prevPosts.map((post) =>
      post.postId === postId
        ? {
            ...post,
            liked: data.liked,
            likesCount: data.likesCount
          }
        : post
    )
  );

  // ✅ Send notification only if post was liked (not unliked)
  if (data.liked === true) {
    console.log("inside if - sending notification");

    // await axios.post(
    //   "/send-notification",
    //   {
    //     userId: postCreatorId, // The owner of the post
    //     senderId: userId,      // The person who liked the post
    //     type: "Like Notification",
    //     title: "New Like",
    //     body: "liked your post"
    //   },
    //   {
    //     headers: {
    //       "Content-Type": "application/json",
    //       Authorization: `Bearer ${token}`
    //     }
    //   }
    // );

    console.log("✅ Notification Sent Successfully");
  }

} catch (error) {
  console.error("Error updating like status:", error);
}

  };
  

  const handleToggleMenu = (postId) => {
    setShowMenus((prevMenus) => ({
      ...prevMenus,
      [postId]: !prevMenus[postId]
    }));
  };


  const reportPost = (postId) => {
    const token = localStorage.getItem("token");

    // Decode the JWT token to get the userId
    const payload = parseJwt(token);
    if (!payload || !payload.userId) {
        alert("User not authenticated. Please log in again.");
        return;
    }

    const userId = payload.userId;

    // Redirect to the report page with query parameters
    navigate(`/report?postId=${postId}`);
};

const parseJwt = (token) => {
    try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        return JSON.parse(window.atob(base64));
    } catch (error) {
        console.error("Invalid token format");
        return null;
    }
};


const savePost = async (postId)  => {

  if (!token) {
    
    toast.error("Please log in to save posts.", { duration: 2500 });
    return;
  }

  const userId = authuser.userId;
  const saveData = { userId, postId };

  try {
    const response = await api.post(
      "/posts/save",
      saveData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (response.data.success) {
      toast.success("Post saved successfully!", { duration: 2500 });
    } else {
      toast.error(response.data.message || "Failed to save post.", { duration: 2500 });
    }
  } catch (error) {
    if (error.response?.status === 401) {
      console.error("Authentication failed. Please log in again.");
      toast.error("Please log in again.", { duration: 2500 });
    } else {
      console.error("Error:", error);
      toast.error("An error occurred. Please try again.", { duration: 2500 });
    }
  }
}


const copyPostIdToClipboard = (postId) => {
  const postUrl = `/posts/${postId}`; 
  navigator.clipboard.writeText(`${import.meta.env.VITE_FRONTEND_URL}${postUrl}`)
    .then(() => toast.success("Post link copied! Share it anywhere."))
    .catch(err => console.error('Failed to copy:', err));
};



const deletePost = async (postId) => {
  try {
    const response = await api.delete(`/posts/${postId}`, {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    });

    
    toast.success("Post deleted successfully!", { duration: 1500 });
      

setPosts((prevPosts) => {

  return prevPosts.filter((post) => post.postId !== postId);
});

  } catch (error) {
    console.error("Error deleting post:", error);
    toast.error("Failed to delete post", { duration: 2500 });
  }
};
  


  const handleAddComment = async (postId,postCreatorId) => {

  if (!token) {
    alert("No token found. Please log in again.");
    return;
  }



  try {
  // 1️⃣ First API Call: Add Comment
  const response = await api.post(
    `/posts/comment/${postId}`,
    { text: newComment },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  console.log("✅ Comment Added:", response.data);

  await fetchPosts();
  setNewComment('');

  // 2️⃣ Second API Call: Send Notification to Post Owner
  // await axios.post(
  //   "/send-notification",
  //   {
  //     userId: postCreatorId, // The owner of the post
  //     senderId: userId,      // The person who commented
  //     type: "Comment Notification",
  //     title: "New Comment",
  //     body: "Commented on Your Post",
  //   },
  //   {
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${token}`,
  //     }
  //   }
  // );

  console.log("✅ Notification Sent Successfully");

} catch (error) {
  console.error("Error adding comment or sending notification:", error);
}

};



const handleAddReply = async (replyId) => {

  if (!token) {
    alert("No token found. Please log in again.");
    return;
  }


  try {
  const response = await api.post(
    `/posts/comment/reply/${replyId}`,
    { text: replyTexts[replyId] || "" },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  console.log("✅ Reply Added:", response.data);

  await fetchPosts(); // Reload posts after reply is added
  clearReplyText(replyId);
  setReplyingTo((prev) => ({ ...prev, [replyId]: false }));

} catch (error) {
  console.error("Error adding reply:", error);
  alert("Failed to add reply");
}


};

const toggleComments = (postId) => {
  setOpenComments((prev) => ({
    ...prev,
    [postId]: !prev[postId]
  }));
};


const handleReplyChange = (replyId, text) => {
  setReplyTexts((prev) => ({
    ...prev,
    [replyId]: text,
  }));
};




const clearReplyText = (replyId) => {
  setReplyTexts((prev) => ({
    ...prev,
    [replyId]: "",
  }));
};


const toggleReplyInput = (replyId) => {
  setReplyingTo((prev) => ({
    ...prev,
    [replyId]: !prev[replyId],
  }));
};


const goToUserProfile = (userId) => {
  // navigate(`/profile/${userId}`); 
  setProfileId(userId);
  // userId===currentuserId?navigate(`/profile`):navigate(`/other/${userId}`);
};

// useEffect(async ()=>{
//   if(profileId!=null){
//     if(profileId==currentuserId){
      
//       navigate('/profile');
//     }
//     else {

//       const token=localStorage.getItem('token');
//       if(!token)
//         return;
//       await axios.post("http://localhost:7000/send-notification",
//         {
//           userId: profileId,    // The owner of the post
//           senderId: currentuserId,         // The person who commented
//           type: "Profile View Notification",
//           title: "Profile View",
//           body: "Viewed Your Profile ",    // Send the comment text as notification body
//         },
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           }
//         }
//       );

//       console.log("✅ View Notification Sent Successfully");

//       alert("navigating to other profile! ");
//       console.log("before navigating!");
//       console.log(profileId)
//       console.log(currentuserId);

//       navigate('/other');
//     }
//   }
// },[profileId]);

useEffect(() => {
  const sendNotification = async () => {
    if (profileId != null) {
      if (profileId === currentuserId) {
        navigate('/profile');
      } else {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
          await axios.post(
            "/send-notification",
            {
              userId: profileId, // The owner of the post
              senderId: currentuserId, // The person who commented
              type: "Profile View Notification",
              title: "Profile View",
              body: "Viewed Your Profile", // Send the comment text as notification body
            },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          console.log("✅ View Notification Sent Successfully");
         

          navigate('/other');
        } catch (error) {
          console.error("Error sending notification:", error);
        }
      }
    }
  };

  sendNotification(); // Call the async function inside useEffect
}, [profileId]);

// const handleMediaChange = (e) => {
//   const file = e.target.files[0];
//   if (file) {
//     setMediaContent(file);
//   }
// };

const removePreview = () => {
  setMediaContent(null); // Clear the media content state
  fileInputRef.current.value = ""; // Clear the file input field
};
const handleMediaChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    setMediaContent(file); // Save the selected file
  } else {
    setMediaContent(null); // Clear the preview if no file is selected
  }
};



async function handleDeleteComment(commentId) {

  if (!token) {
    console.error("User is not authenticated.");
    return;
  }



  try {
    const response = await api.delete(
      `/posts/comment/delete/${commentId}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    // console.log("Comment deleted successfully:", response.data);

    // Update UI by removing the deleted comment
    setPosts(prevPosts =>
      prevPosts.map(post => ({
        ...post,
        comments: post.comments.filter(comment => comment.commentId !== commentId)
      }))
    );

  } catch (error) {
    if (error.response?.status === 401) {
      console.error("Authentication failed. Please log in again.");
    
    } else {
      console.error("Error deleting comment:", error.response?.data || error.message);
    }
  }
}


function handleEditComment(commentId, currentText) {
  setEditingCommentId(commentId); // Track which comment is being edited
  setEditText(currentText); // Store the existing comment text in state
}

async function handleSaveEdit(commentId) {

  if (!token) {
    console.error("User is not authenticated.");
    return;
  }


  const targetPost = posts.find(post =>
    post.comments.some(comment => comment.commentId === commentId)
  );
  const targetComment = targetPost?.comments.find(c => c.commentId === commentId);
  if (targetComment?.text.trim() === editText.trim()) {
    console.warn("No changes detected, skipping update.");
    setEditingCommentId(null);
    return;
  }

  try {
    const response = await api.put(
      `/posts/comment/edit/${commentId}`,
      { text: editText },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    console.log("Comment updated successfully:", response.data);

    // Update UI with new comment text
    setPosts(prevPosts =>
      prevPosts.map(post => ({
        ...post,
        comments: post.comments.map(comment =>
          comment.commentId === commentId
            ? { ...comment, text: editText }
            : comment
        )
      }))
    );

    setEditingCommentId(null); 
  } catch (error) {
    if (error.response?.status === 401) {
      console.error("Authentication failed. Please log in again.");
      
    } else {
      console.error("Error updating comment:", error);
    }
  }
}


function handleEditReply(commentId, replyId, currentText) {
  setEditingReplyId(replyId); // Track which reply is being edited
  setEditText(currentText); // Store the existing reply text in state
}

async function handleSaveEditReply(commentId, replyId) {

  if (!token) {
    console.error("User is not authenticated.");
    return;
  }

  //Avoid unnecessary API call if text is same
  const targetPost = posts.find(post =>
    post.comments.some(comment =>
      comment.commentId === commentId &&
      comment.replies.some(reply => reply.replyId === replyId)
    )
  );

  const targetComment = targetPost?.comments.find(c => c.commentId === commentId);
  const targetReply = targetComment?.replies.find(r => r.replyId === replyId);

  if (targetReply?.text.trim() === editText.trim()) {
    console.warn("No changes detected in reply text. Skipping update.");
    setEditingReplyId(null);
    return;
  }

  try {
    const response = await api.put(
      `/posts/reply/edit/${replyId}`,
      { text: editText },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );


    // Update UI to show the edited reply text
    setPosts(prevPosts =>
      prevPosts.map(post => ({
        ...post,
        comments: post.comments.map(comment =>
          comment.commentId === commentId
            ? {
                ...comment,
                replies: comment.replies.map(reply =>
                  reply.replyId === replyId ? { ...reply, text: editText } : reply
                )
              }
            : comment
        )
      }))
    );

    setEditingReplyId(null); // Exit edit mode
  } catch (error) {
    if (error.response?.status === 401) {
      console.error("Authentication failed. Please log in again.");
    } else {
      console.error("Error updating reply:", error.response?.data || error.message);
    }
  }
}





async function handleDeleteReply(commentId, replyId) {

  if (!token) {
    console.error("User is not authenticated.");
    return;
  }



  try {
    const response = await api.delete(
      `/posts/reply/delete/${replyId}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );



      // Update UI by removing the deleted reply
      setPosts(prevPosts =>
        prevPosts.map(post => ({
          ...post,
          comments: post.comments.map(comment =>
            comment.commentId === commentId
              ? {
                  ...comment,
                  replies: comment.replies.filter(reply => reply.replyId !== replyId)
                }
              : comment
          )
        }))
      );
    
  } catch (error) {
    if (error.response?.status === 401) {
      console.error("Authentication failed. Please log in again.");
    } else {
      console.error("Error deleting reply:", error.response?.data || error.message);
    }
    
  }
}


return (



  <div className="post-component-container" style={postComponentContainerStyle}>

  {/* <Fest /> */}
  {/* <HoliBanner /> */}
  
  <div style={postInputContainerStyle}>
  <form onSubmit={handleSubmit}>
    <textarea
      placeholder="Share your thoughts...."
      value={postContent || ""}
      onChange={(e) => setPostContent(e.target.value)}
      style={textareaStyle}
    />

    {/* Media Preview */}
    {mediaContent && (
      <div style={{ marginTop: '10px', position: 'relative' }}>
        {mediaContent.type.startsWith('video') ? (
          <video
            src={URL.createObjectURL(mediaContent)}
            controls
            style={{
              maxWidth: '100%',
              maxHeight: '300px',
              borderRadius: '5px',
            }}
          />
        ) : (
          <img
            src={URL.createObjectURL(mediaContent)}
            alt="Preview"
            style={{
              maxWidth: '100%',
              maxHeight: '300px',
              borderRadius: '5px',
              objectFit: 'contain',
            }}
          />
        )}
        <button
          type="button"
          onClick={removePreview}
          style={removeButtonStyle}
        >
          Remove
        </button>
      </div>
    )}

    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
      <button
        type="button"
        onClick={() => fileInputRef.current.click()} // Trigger the hidden file input click
        style={customUploadButtonStyle}
      >
        Upload Media
      </button>
      <input
        type="file"
        accept="image/*,video/*"
        ref={fileInputRef}
        onChange={(e) => handleMediaChange(e)}
        style={hiddenFileInputStyle} // Hide the default file input
      />
      <button type="submit" disabled={isPosting} style={submitButtonStyle}>
        {isPosting ? "Posting...." : "Post"}
      </button>
    </div>
  </form>
</div>


    <div  style={{ marginTop: '20px' }}>
      {posts.map((post) => (
        <div key={post.postId} style={userPostStyle}>
          <div style={postHeaderStyle}>
            <div style={userInfoStyle}  onClick={() => goToUserProfile(post.userId._id)}>
              <img
                src={post.user.profilePic === '/images/squarepfp.png' ? '/images/squarepfp.png' : `${post.user.profilePic}`}
                alt="User Profile"
                style={profilePicStyle}
              />
              
              

              <div style={userDetailsStyle}>
              <span style={usernameStyle}>{post.user?.username || "Anonymous"}</span>
              <span style={bioStyle}>{post.userId?.bio || ""}</span>

              </div>


             

            </div>

            <div style={{ position: 'relative' }}>

            <button style={toggleButtonStyle} onClick={() => handleToggleMenu(post.postId)}>⋮</button>
            {showMenus[post.postId] && (
              <div style={dropdownMenuStyle}>
                <div style={menuItemStyle} onClick={() => savePost(post.postId)}>Save</div>
                

                <div style={menuItemStyle} onClick={() => reportPost(post.postId)}>Report</div>
                {/* //delete */}
                {post.userId._id === currentuserId && (
                <div style={menuItemStyle} onClick={() => deletePost(post.postId)}>Delete</div>
                )}
              </div>
            )}
          </div>
          </div>

          <p style={{
      wordWrap: 'break-word',
      wordBreak: 'break-word',
      overflowWrap: 'break-word',
      overflow: 'hidden', // Hide any text that exceeds the container
      whiteSpace: 'pre-wrap', // Preserve line breaks while wrapping
      maxWidth: '100%', // Ensure the text stays within the container width
      paddingLeft:'20px',
      paddingRight:'20px'
    }}>
      {post.caption}
    </p>

          {post.content && post.content.mediaUrl && (
            post.postType === 'video' ? (
              <video
                src={`${post.content.mediaUrl}`}
                controls
                style={postMediaStyle}
              />
            ) : (
              <img
                src={`${post.content.mediaUrl}`}
                alt="Post Media"
                style={postMediaStyle}
              />
            )
          )}

          <div style={postFooterStyle}>
            <button
              style={postButtonStyle}
              onClick={() => handleLikeToggle(post.postId,post.userId._id)}
            >
             <div className="flex items-center justify-center">
    <img src="/images/like.jpg" className="h-6 w-6 mr-2" alt="Like" />
    {post.likesCount}
  </div>
              



            </button>
            <button style={postButtonStyle} onClick={() => toggleComments(post.postId,post.userId._id)}>
              {/* {`💬 Comment ${post.comments.length}`} */}
              <div className="flex items-center justify-center"> 
                <img src="/images/comments.jpeg" className="w-6 h-6 mr-4" />
                <p>{`${post.comments.length}`}</p>

              </div>

            </button>
            <button style={postButtonStyle} onClick={() => copyPostIdToClipboard(post.postId)}>
              {/* 🔗 Share */}
              <div className="flex items-center justify-center">
              <img src='/images/share.jpeg' className="w-6 h-6 mr-4" />
              {/* <p>Share</p>  */}
              </div>
               
            </button>
          </div>

         {/* Comment Section */}
{openComments[post.postId] && (
  <div style={{ padding: "10px", border: "1px solid #ccc" }}>
    {post.comments.map((comment) => (
      
     


      <div key={comment.commentId} style={{ margin: "10px 0" }}>
        <strong>{comment.user?.username || "Anonymous"}:</strong> 

        {console.log("comment")}
        {console.log(comment)}

        {/* {comment.text} */}

         {/* Show input field if editing */}
    {editingCommentId === comment.commentId ? (
      <input
        type="text"
        value={editText}
        onChange={(e) => setEditText(e.target.value)}
        style={{ border: "2px solid black", padding: "5px", borderRadius: "4px" }} 
      />
    ) : (
      <span>{comment.text}</span>
    )}

        <div>
          {/* <button onClick={() => toggleCommentLike(comment.commentId)}> */}
            {/* Like button content */}
          {/* </button> */}
          <button className="mr-4" onClick={() => toggleReplyInput(comment.commentId)}>Reply</button>
          {/* {comment.user.userId === currentuserId && (
            <>
              <button onClick={() => handleEditComment(comment.commentId)}>Edit</button>
              <button onClick={() => handleDeleteComment(comment.commentId)}>Delete</button>
            </>
          )} */}

      {comment.user.userId === currentuserId && (
        <>
          {editingCommentId === comment.commentId ? (
            <>
              <button className="mr-4" onClick={() => handleSaveEdit(comment.commentId)}>Save</button>
              <button className="mr-4" onClick={() => setEditingCommentId(null)}>Cancel</button>
            </>
          ) : (
            <button className="mr-4" onClick={() => handleEditComment(comment.commentId, comment.text)}>Edit</button>
          )}
          <button onClick={() => handleDeleteComment(comment.commentId)}>Delete</button>
        </>
      )}


        </div>

        {/* Display replies */}
        <div style={{ marginLeft: "20px" }}>
        {comment.replies.map((reply) => (
    <div key={reply.replyId} className="mb-1">
      <strong>{reply.user?.username || "Anonymous"}:</strong> 

      {/* If editing this reply, show input field */}
      {editingReplyId === reply.replyId ? (
        <>
          <input 
            type="text" 
            placeholder="Enter the new reply!"
            value={editText} 
            onChange={(e) => setEditText(e.target.value)} 
            style={{ border: "2px solid black", padding: "5px", borderRadius: "4px" }} 
          />
          <button className="mr-4" onClick={() => handleSaveEditReply(comment.commentId, reply.replyId)}>Save</button>
          <button onClick={() => setEditingReplyId(null)}>Cancel</button>
        </>
      ) : (
        <>
          {reply.text}
          {reply.user.userId === currentuserId && (
            <div>
              <button className="mr-4" onClick={() => handleEditReply(comment.commentId, reply.replyId,reply.text)}>Edit</button>
              <button onClick={() => handleDeleteReply(comment.commentId, reply.replyId)}>Delete</button>
            </div>
          )}
        </>
      )}
    </div>
  ))}
        </div>

        {/* Reply input for each comment */}
        {replyingTo[comment.commentId] && (
          <div style={{ marginLeft: "20px" }}>
            <textarea
              placeholder="  Write a reply..."
              value={replyTexts[comment.commentId] || ""}
              onChange={(e) => handleReplyChange(comment.commentId, e.target.value)}
              style={{ width: "100%", margin: "5px 0", border: "2px solid black" }}
            />
            <div class="flex justify-end">
              <button onClick={() => handleAddReply(comment.commentId)}>Reply</button>
            </div>
          </div>
        )}
      </div>
    ))}

    {/* New comment input */}
    <textarea
      class="border-2 border-black"
      placeholder="  Write a comment..."
      value={newComment}
      onChange={(e) => setNewComment(e.target.value)}
      style={{ width: "100%", margin: "5px 0" }}
    />
    <div class="flex justify-end">
      <button class="text-right pl-2 pr-2" onClick={() => handleAddComment(post.postId,post.userId._id)}>Comment</button>
    </div>
  </div>
)}

        </div>
      ))}
    </div>
  </div>
  
);


}
   
export default PostComponent;
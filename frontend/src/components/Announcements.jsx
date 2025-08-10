
// 💻 FRONTEND COMPONENT
// components/AnnouncementsPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { toast } from 'react-hot-toast';

const Announcements = () => {
  const { id: communityId } = useParams();
  const [announcements, setAnnouncements] = useState([]);
  const [user, setUser] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [text, setText] = useState("");
  const [media, setMedia] = useState(null);
  const [posting,setPosting]=useState(false);


  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setUser(decoded);
    }
  }, []);

  useEffect(() => {
    if(user){
      console.log("inside use effect!")
      fetchAnnouncements();
      checkIfAdmin();
    }
  }, [user]);

  const fetchAnnouncements = async () => {
    try {
        console.log("fetching...")
      const res = await axios.get(`/community/get/announcements/${communityId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setAnnouncements(res.data);
    } catch (err) {
      console.error("Error fetching announcements", err);
    }
  };

  const checkIfAdmin = async () => {

    try {
      console.log("user.userId:", user?.userId);
      const res = await axios.get(`/community/get/${communityId}`);
      console.log("response");
      console.log(res);
      console.log("admins from response:", res.data.admins);

      res.data.admins.forEach(admin => {
        console.log("Comparing:", admin._id, "===", user?.userId);
      });
  
      const checkAdmin = res.data.admins.some(admin => admin._id === user?.userId);
      // console.log(checkAdmin);
      console.log("Admin Check Result:", checkAdmin);
      setIsAdmin(checkAdmin);
    } catch (err) {
        console.log(`error: ${err}`);
      console.error("Error checking admin status", err);
    }
  };

  const handlePost = async () => {
    setPosting(true);
    if (!title || !content) return;
    try {
      await axios.post(
        `/community/post/announcements/${communityId}`,
        { title, content },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setTitle("");
      setContent("");
      fetchAnnouncements();
    } catch (err) {
      console.error("Failed to post announcement", err);
    }
    finally{
      setPosting(false);
    }
  };


  const handleMediaChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setMedia(file);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();    
    setPosting(true);
    const token = localStorage.getItem("token");
    if (!token) {
        toast.error("No token found. Please log in again.");
        return;
    }
    
    if (!text?.trim() && !media) {
        toast.error("Post cannot be empty!");
        return;
    }

    let mediaUrl = null;

    // Upload media to Cloudinary if present
    if (media) {
        try {
            const cloudinaryData = new FormData();
            cloudinaryData.append("file", media);
            cloudinaryData.append("upload_preset", "simpleunsigned");

            const cloudResponse = await fetch("https://api.cloudinary.com/v1_1/dhtk7vhyv/upload", {
                method: "POST",
                body: cloudinaryData,
            });

            if (!cloudResponse.ok) {
                throw new Error("Cloudinary upload failed");
            }

            const cloudData = await cloudResponse.json();
            mediaUrl = cloudData.secure_url;
            console.log(`mediaUrl:${mediaUrl}`);
        } catch (error) {
            console.error("Media upload error:", error);
       
            return;
        }
    }

    // Decode userId from token
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = JSON.parse(atob(base64));
    const userId = jsonPayload.userId;
    
    // const groupId = id; // Ensure groupId is retrieved correctly

    // const formData = new FormData();
    // formData.append("userId", userId);
    // formData.append("comId", communityId);
    // if (text?.trim()) formData.append("caption", text.trim());
    // if (mediaUrl) formData.append("media", mediaUrl);


    try {
      // console.log("formdata");
      // console.log(formData);
      // for (let pair of formData.entries()) {
      //   console.log(pair[0], pair[1]);
      // }

      const payload = {
        userId,
        cgId: communityId,
        caption: text?.trim(),
        media: mediaUrl,
      };

        const response = await axios.post(
          `/community/post/announcements/${communityId}`,
          
          payload, // directly pass the formData as the body
          
        );

        console.log(response);
        // if (!response.ok) {
        //     throw new Error("Failed to create post");
        // }

        setText("");
        setMedia(null);
        // if (fileInputRef.current) fileInputRef.current.value = "";
        toast.success("Announcement created successfully"); 

        fetchAnnouncements(); // Refresh posts
    } catch (error) {
        console.error("Error submitting form:", error);
        // toast.error("Error in creating post. Please try again.");
    } 
    finally{
      setPosting(false);
    }
};


  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6 text-center text-[#3b5998]">Announcements</h1>



      {isAdmin && (

         
<div className="bg-white p-5 rounded shadow-lg">
<div className="flex items-center space-x-4">
  {/* <img src={user?.profilePic} className="w-12 h-12 rounded-full" alt="Profile" /> */}
  <input
    type="text"
    placeholder="Write something..."
    className="flex-1 border p-3 rounded-lg"
    value={text}
    onChange={(e) => setText(e.target.value)}
  />
  <button
    onClick={handleSubmit}
    disabled={posting}
    className={`bg-blue-600 text-white px-4 py-2 rounded-lg ${posting && 'cursor-not-allowed'}`}
  >
    {posting ? "Posting...." : "Post"}
  </button>
</div>
{media && (
  <div className="mt-3">
  
  {media.type.startsWith('video') ? (
    <video
      src={URL.createObjectURL(media)}
      controls
      className="w-20 h-20 object-cover rounded"

    />
  ) : (
    <img
      src={URL.createObjectURL(media)}
      alt="Preview"
      className="w-20 h-20 object-cover rounded"
     
    />
  )}

  </div>
)}
<div className="flex space-x-6 mt-3 text-blue-600 text-sm font-semibold">
  <label htmlFor="imageUpload" className="cursor-pointer">📷 Photo</label>
  <input
    type="file"
    id="imageUpload"
    className="hidden"
    accept="image/*,video/*"
    onChange={handleMediaChange}
  />
  {/* <span>📁 File</span>
  <span>📌 Poll</span> */}
</div>
</div>

      )}

  {/* //form ended */}

      <div className="space-y-4">

{announcements.length > 0 ? (
            announcements.map((a) => (
              <div key={a._id} className="bg-white p-5 rounded shadow-lg">
                <div className="flex space-x-4">
                  {/* <div className="bg-gray-300 w-12 h-12 rounded-full"></div> */}
                  <img src={a.user?.profilePic} className="w-12 h-12 rounded-full" alt="Profile" />
                  <div>
                    <h4 className="font-bold">{a.user?.username}</h4>
                    <p className="text-sm text-gray-600">{new Date(a.createdAt).toLocaleString()}</p>
                    <p className="mt-2">{a.caption}</p>
                    {/* {post.image && <img src={post.image} alt="Post" className="max-h-48 w-full object-cover rounded-lg mt-3" />} */}
                    {a.postType=='image' && <img src={a.media} alt="Image" className="max-h-48 w-full object-cover rounded-lg mt-3" /> }

                    {a.postType=='video' && <video src={a.media} alt="Video" controls className="max-h-48 w-full object-cover rounded-lg mt-3" /> }

                    
                    
                    {/* <div className="flex space-x-6 text-blue-600 text-sm font-semibold mt-3">
                      <span>👍 Like</span>
                      <span>💬 Comment</span>
                      <span>🔄 Share</span>
                    </div> */}

                    
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600">No posts yet.</p>
          )}



      </div>
    </div>
  );
};

export default Announcements;

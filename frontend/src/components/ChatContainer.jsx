import {useChatStore} from "./useChatStore";
import {useEffect, useState,useRef, useContext} from "react";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import {useSocket} from "./useSocket";
import { useSearchParams } from "react-router-dom";
import api from "../api/api";
import { AuthContext } from "./AuthContext";


const backendBaseUrl="http://localhost:7000";

const renderurl="https://socialmedia-backend-2njs.onrender.com"

const  ChatContainer = () =>{
    const {messages,getMessages,isMessagesLoading,selectedUser,subscribeToMessages,unsubscribeFromMessages,chatUserId,setChatUserId}=useChatStore();
    // const [userId,setUserId]=useState();
    const [user,setUser]=useState();

            const { token, authuser } = useContext(AuthContext);

    const {socket} =useSocket();

    const messageEndRef=useRef(null);

    const [searchParams] = useSearchParams();


    const [showModal, setShowModal] = useState(false); // To track modal visibility
  const [modalMedia, setModalMedia] = useState(""); // To store the media URL for the modal
  const [modalMediaType, setModalMediaType] = useState(""); // To store media type (image/video)

  if (!selectedUser) return <MessageSkeleton />;

  const userId = authuser.userId;


    const formatMessageTime=(date) => {
        return new Date(date).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });
      }

   

    const getUserData= async () =>{
        try{
            const token=localStorage.getItem("token");
            const res=await api.get(`/user/getdetails`,{
                headers: {
                    Authorization:`Bearer ${token}`,
                },

            })
            
            setUser(res.data);
        }
        catch(e){
            console.log("error getting user profilePic!");
        }
    }

    useEffect(() => {
      if(messageEndRef.current && messages){
        messageEndRef.current.scrollIntoView({behavior: "smooth"});
      }

  

    },[messages]);


    useEffect(() => {
      // const chatUserId = searchParams.get("chatUserId");
      if (chatUserId) {
        // Set selected user based on URL
        getMessages(chatUserId);
      }
    }, [chatUserId, getMessages]);



    useEffect(() => {
        
        getMessages(selectedUser._id);

        getUserData();

 

        subscribeToMessages(socket);
       

        return () => unsubscribeFromMessages(socket);


    },[selectedUser._id,getMessages,subscribeToMessages,unsubscribeFromMessages]);

    if(isMessagesLoading) return (
        <div className="flex-1 flex flex-col overflow-auto">
            <ChatHeader />
            <MessageSkeleton />
            <MessageInput />    
        </div>
        
    );

    const handleMediaClick = (mediaUrl, mediaType) => {
      setModalMedia(mediaUrl);
      setModalMediaType(mediaType);
      setShowModal(true); // Open the modal
    };


    return (
        <div className="flex-1 flex flex-col overflow-auto">
  <ChatHeader />

  <div className="flex-1 overflow-y-auto p-4 space-y-4">
    {messages.map((message) => (
      <div
        key={message._id}
        className={`flex ${message.senderId === userId ? "justify-end" : "justify-start"}`}
        ref={messageEndRef}
      >
        {/* Profile Picture */}
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-md border overflow-hidden">
    
            <img
  src={
    message.senderId === userId
      ? user?.profilePic === "/images/default_profile.jpeg"
        ? "/images/default_profile.jpeg"
        : user?.profilePic
        ? `${user?.profilePic}`
        : "/avatar.png"
      : selectedUser.profilePic === "/images/default_profile.jpeg"
      ? "/images/default_profile.jpeg"
      : selectedUser.profilePic
      ? `${selectedUser.profilePic}`
      : "/avatar.png"
  }
  alt="profile pic"
/>

          </div>
        </div>

        {/* Message Content */}
        <div className={`max-w-md ${message.senderId === userId ? "text-right ml-2" : "text-left mr-2"}`}>
          {/* Message Header */}
          <div className="mb-1">
            <time className="text-xs opacity-50">
              {formatMessageTime(message.createdAt)}
            </time>
          </div>

          {/* Chat Bubble */}
          <div
                className={`inline-block rounded-lg ${
                  message.senderId === userId
                    ? "bg-blue-500 text-white"
                    : "bg-blue-500 text-white"
                } ${
                  message.text && !message.media ? "px-4 py-2" : "px-1.5 py-1.5"
                }`}
              >
                {message.media && (
                  <>
                    {message.mediaType === "image" && (
                      <div className="relative">
                        <img
                          src={message.media}
                          alt="Attachment"
                          className="sm:max-w-[200px] rounded-md mb-2"
                          onClick={() => handleMediaClick(message.media, "image")} // Pass type "image"
                        />
                      </div>
                    )}
                    {message.mediaType === "video" && (
                      <div className="relative">
                        <video
                          src={message.media}
                          controls
                          className="sm:max-w-[200px] rounded-md mb-2"
                          onClick={() => handleMediaClick(message.media, "video")} // Pass type "video"
                        />
                      </div>
                    )}
                  </>
                )}
                {/* Text Message */}
                {message.text && <p>{message.text}</p>}
              </div>            
              </div>
          </div>
        ))}
      </div>

  <MessageInput />

        {/* Modal for media */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="relative bg-white p-4 rounded-lg">
            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)} // Close modal
            >
              <span className="text-lg font-bold pt-0">X</span>
            </button>

            {/* Display the modal content */}
            {modalMediaType === "image" && (
              <img
                src={modalMedia}
                alt="Modal Attachment"
                className="max-w-full max-h-[90vh] object-contain"
              />
            )}

            {modalMediaType === "video" && (
              <video
                src={modalMedia}
                
                className="max-w-full max-h-[90vh] object-contain"
              />
            )}
          </div>
        </div>
      )}

</div>
    );
};

export default ChatContainer;
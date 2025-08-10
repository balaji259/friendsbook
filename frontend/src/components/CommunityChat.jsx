import React, { useState, useEffect } from 'react';
import axios from "axios";
import {useNavigate} from "react-router-dom";
import { jwtDecode } from 'jwt-decode';
import { useSocket } from "./useSocket"; // adjust path as needed



const CommunityChat = () => {

  const { socket } = useSocket();

  const [User,setUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentUserId,setCurrentUserId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');



  const [members,setMembers]=useState(null);

  
  const communityId = "6805ecc8f649c8ae88b2ed75";

  const navigate = useNavigate();

  const fetchUserId = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        alert("Please login again!");
        navigate('/');
        return; // ✅ Important: stop execution if no token
      }
  
      const user = jwtDecode(token);
      console.log("Decoded user:", user);
  
      setUser(user);
      setCurrentUserId(user.userId); // or user._id depending on your token structure
  
    } catch (e) {
      console.log("JWT Decode Error:", e.message);
      alert("Session expired. Please login again.");
      navigate('/');
    }
  };
  

  const fetchMembers = async ()=>{
    try{
        const response=await axios.get(`http://localhost:7000/community/6805ecc8f649c8ae88b2ed75/members`);
        setMembers(response.data);
    }
    catch(e)
    {
        console.log(e.message);
    }
  }

  

  useEffect(()=>{
    fetchUserId();
    fetchMembers();
  },[])

  useEffect(() => {
    if (!socket || !selectedUser) return;
  
    const handleNewMessage = (newMessage) => {
  
      console.log("inside the on event!");
      console.log("Received new message:", newMessage);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    };
  
    socket.on("newCommunityMessage", handleNewMessage);
  
    return () => {
      socket.off("newCommunityMessage", handleNewMessage);
    };
  }, [socket, selectedUser]);
  

  const handleSend = async () => {
    if (!newMsg.trim()) return;

      try {
            console.log("before sending message");
          
            const token=localStorage.getItem('token');
            if(!token){
              alert("Please login again !");
              navigate("/");
              return;
            }
            
      
            const msgData ={
                communityId: "6805ecc8f649c8ae88b2ed75",
                senderId: currentUserId,
                receiverId: selectedUser._id,
                text: newMsg,
                media: null,
                

            };
           
            const response=await axios.post(`http://localhost:7000/messages/community/send/${selectedUser._id}`,msgData,{
            
              headers: {
                Authorization: `Bearer ${token}`,
              },

            });

            console.log('existing messages');
            console.log(messages);

            setMessages([...messages, response.data]);

            console.log("updated messages");
            console.log(messages);

            //main
            // setMessages([...messages, newMessage]);
            setNewMsg('');

            
        } catch (e) {
            console.log(e.message);
        } 

    // const newMessage = {
    //   sender: 'me',
    //   content: newMsg,
    //   timestamp: new Date().toISOString()
    // };

  
  };

  const fetchMessages = async (receiverId) => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`http://localhost:7000/messages/community/${communityId}/with/${receiverId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("messages");
    console.log(response);
    setMessages(response.data);
  };
  
  useEffect(() => {
    if (selectedUser) {
      fetchMessages(selectedUser._id);
    }
  }, [selectedUser]);
  

  if (!members)
    return (
      <div className="flex items-center justify-center h-screen text-gray-500 text-xl">
        Loading community members...
      </div>
    );
  

  return (
    <div className="flex h-screen font-sans">
      
      {/* Left Panel - Members */}
      <div className="w-1/4 bg-gray-100 border-r overflow-y-auto p-4">
        <h2 className="text-xl font-bold mb-4">Community Members</h2>
        {members.map(user => (
          <div
            key={user._id}
            className={`p-2 rounded cursor-pointer mb-2 ${
              selectedUser?._id === user._id ? 'bg-blue-200 font-semibold' : 'hover:bg-gray-200'
            }`}
            onClick={() => setSelectedUser(user)}
          >
            {user.fullname}
          </div>
        ))}
      </div>

      {/* Right Panel - Chat */}
      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="p-4 bg-blue-100 text-lg font-semibold border-b">
              Chat with {selectedUser.fullname}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`mb-2 max-w-[60%] ${
                    msg.senderId === currentUserId ? 'ml-auto text-right text-green-600' : 'text-left text-blue-600'
                  }`}
                >
                  <div className="bg-white shadow p-2 rounded">{msg.text}</div>
                </div>
              ))}
            </div>

            {/* Input Field */}
            <div className="flex items-center border-t p-3">
              <input
                type="text"
                placeholder="Type your message..."
                className="flex-1 p-2 border rounded focus:outline-none focus:ring"
                value={newMsg}
                onChange={(e) => setNewMsg(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              />
              <button
                className="ml-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                onClick={handleSend}
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center flex-1 text-gray-500 text-lg">
            Select a user to start chatting
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityChat;

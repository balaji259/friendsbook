import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Send, Users } from "lucide-react";

const backendBaseUrl = "https://friendsbook-cy0f.onrender.com";

let socket;

const GroupDiscussion = () => {
  const { id } = useParams(); // community ID from URL
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [groupName, setGroupName] = useState("Group Discussion");
  const chatRef = useRef();
  const inputRef = useRef();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
        console.log("Decoded token:", decoded);

        // Initialize socket connection here after token is available
        socket = io(backendBaseUrl, {
          auth: { token },
        });
      } catch (err) {
        console.error("Invalid token", err);
      }
    }
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`/group/${id}/getdiscussions`);
      console.log(response.data);
      setMessages(response.data);
      
      // You could also fetch community name here if you have an endpoint for it
      // const communityResponse = await axios.get(`${backendBaseUrl}/community/${id}`);
      // setCommunityName(communityResponse.data.name);
    } catch (e) {
      console.log(`Error fetching messages: ${e.message}`);
    }
  };

  useEffect(() => {
    if (!user || !socket) return;

    console.log("Joining group room:", id);
    socket.emit("joinCommunityRoom", {
      id,
      userName: user.username || user.name,
    });

    fetchMessages();

    socket.on("receiveMessage", (msg) => {
      console.log("Received message:", msg);
      if (msg.communityId === id) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [id, user]);

  useEffect(() => {
    chatRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!text.trim() || !user || !socket) return;

    const messagePayload = {
      communityId: id,
      userId: user.userId || user._id,
      userName: user.name || user.username,
      text,
    };

    console.log("Sending message:", messagePayload);
    socket.emit("sendMessageToCommunity", messagePayload);
    setText("");
    inputRef.current.focus();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Group messages by date
  const groupMessagesByDate = () => {
    const groups = {};
    
    messages.forEach(msg => {
      const date = msg.createdAt 
        ? new Date(msg.createdAt).toLocaleDateString() 
        : 'Today';
      
      if (!groups[date]) {
        groups[date] = [];
      }
      
      groups[date].push(msg);
    });
    
    return groups;
  };

  const messageGroups = groupMessagesByDate();
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      {/* <header className="bg-white border-b border-gray-200 shadow-sm py-4 px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-indigo-100 p-2 rounded-full">
              <Users className="h-5 w-5 text-indigo-600" />
            </div>
            <h1 className="text-xl font-bold text-gray-800">{communityName}</h1>
          </div>
          <div className="text-sm text-gray-500">
            {messages.length} messages
          </div>
        </div>
      </header> */}

      {/* Chat container */}
      <div className="flex-1 overflow-hidden max-w-5xl w-full mx-auto px-4 py-6">
        <div className="h-full flex flex-col bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Messages area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {Object.entries(messageGroups).map(([date, dateMessages]) => (
              <div key={date} className="space-y-3">
                <div className="flex justify-center">
                  <div className="bg-gray-100 text-gray-500 text-xs px-3 py-1 rounded-full">
                    {date}
                  </div>
                </div>
                
                {dateMessages.map((msg, i) => {
                  const isCurrentUser = msg.userId === (user?.userId || user?._id);
                  const showAvatar = 
                    i === 0 || 
                    dateMessages[i-1]?.userId !== msg.userId;
                  
                  return (
                    <div 
                      key={i} 
                      className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'} max-w-[80%] items-end`}>
                        {showAvatar && (
                          <div className={`flex-shrink-0 ${isCurrentUser ? 'ml-2' : 'mr-2'}`}>
                            <div className={`h-8 w-8 rounded-full flex items-center justify-center text-white font-medium text-sm ${isCurrentUser ? 'bg-[#3b5998]' : 'bg-gray-500'}`}>
                              {(msg.userName || 'User').charAt(0).toUpperCase()}
                            </div>
                          </div>
                        )}
                        <div className={`${!showAvatar ? (isCurrentUser ? 'mr-10' : 'ml-10') : ''}`}>
                          <div className="flex flex-col">
                            {showAvatar && (
                              <span className={`text-xs text-gray-500 mb-1 ${isCurrentUser ? 'text-right' : 'text-left'}`}>
                                {msg.userName || 'User'}
                              </span>
                            )}
                            <div className={`px-4 py-2 rounded-2xl ${
                              isCurrentUser 
                                ? 'bg-[#3b5998] text-white rounded-tr-none' 
                                : 'bg-gray-100 text-gray-800 rounded-tl-none'
                            }`}>
                              <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                            </div>
                            <span className={`text-xs text-gray-400 mt-1 ${isCurrentUser ? 'text-right' : 'text-left'}`}>
                              {formatTime(msg.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
            <div ref={chatRef}></div>
          </div>

          {/* Input area */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-end gap-2">
              <div className="flex-1 bg-gray-100 rounded-lg px-4 py-3">
                <textarea
                  ref={inputRef}
                  rows="1"
                  placeholder="Type a message..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={handleKeyPress}
                  className="w-full bg-transparent resize-none focus:outline-none text-gray-700 placeholder-gray-500"
                />
              </div>
              <button
                onClick={sendMessage}
                disabled={!text.trim()}
                className={`p-3 rounded-full ${
                  text.trim() 
                    ? 'bg-[#3b5998] hover:bg-[#3b5998] text-white' 
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                } transition-colors duration-200`}
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupDiscussion;
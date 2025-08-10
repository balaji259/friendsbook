import React, { createContext, useContext, useState, useEffect } from "react";
import { io } from "socket.io-client";

const backendBaseUrl = "https://friendsbook-cy0f.onrender.com";
const renderurl="https://socialmedia-backend-2njs.onrender.com";

// Create Context
const SocketContext = createContext();

// Provider Component
export const SocketProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [socket, setSocket] = useState(null);
  const [onlineUsers,setOnlineUsers]=useState([]);


  useEffect(() => {
 
    if(user)
    {
      connectSocket();
    }
}, [user]);


useEffect(() => {
  
  if (onlineUsers.length > 0) {
    console.log(onlineUsers);
  }
}, [onlineUsers]);


  // Connect Socket
  const connectSocket = () => {


    
    
    if (!user) {
      console.error("Cannot connect socket: User is not logged in.");
      return;
    }
    
    if (socket?.connected) {
      // console.log("Socket is already connected.");
      return;
    }
    
    const token = localStorage.getItem("token"); // Retrieve the token
  if (!token) {
    console.error("Cannot connect socket: Token is not available.");
    return;
  }
    
 

    // Pass the token during the connection
  const newSocket = io("/", {
    auth: {
      token, // Include the token in the WebSocket handshake
    },
  });

    
    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id);
    });

    newSocket.on("disconnect", () => {
      console.log("Socket disconnected.");
    });

    
    newSocket.on("getOnlineUsers",(userIds) => {
      // setOnlineUsers(userIds);
      console.log("setting online users !");
      setOnlineUsers([...new Set(userIds)]);
    })    
    
    setSocket(newSocket); // Set the new socket reference

    // return () => {
    //   newSocket.off("getOnlineUsers");
    // };


  };

  // Disconnect Socket
  const disconnectSocket = () => {
    if (socket?.connected) {
      // console.log("Disconnecting socket:", socket.id);
      console.log("Disconnecting socket:", socket.id);//added
      socket.off("getOnlineUsers"); // Clean up listener

      socket.disconnect();
      setSocket(null);
      // console.log("socket cleaned up");
      // console.log("Socket disconnected successfully.");
    } else {
      console.log("Socket is not connected or already null.");
    }
  };



  useEffect(() => {
    return () => {
      if (socket) {
        console.log("Cleaning up socket during unmount.");
        disconnectSocket();
      }
    };
  }, []);
  


  return (
    <SocketContext.Provider
      value={{
        user,
        setUser,
        socket,
        onlineUsers,
        setOnlineUsers,  
        connectSocket,
        disconnectSocket,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

// Hook for consuming context
export const useSocket = () => useContext(SocketContext);

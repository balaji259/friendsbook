import {create} from "zustand";
import { useContext } from "react";
import toast from "react-hot-toast";
import { jwtDecode } from 'jwt-decode';
import {useSocket} from "./useSocket";
import api from "../api/api";
import { AuthContext } from "./AuthContext";

export const useChatStore = create((set,get)=>({
    
    
   
    messages:[],
    users:[],
    selectedUser:null,
    chatUserId: null, 
    isUsersLoading:false,
    isMessagesLoading:false,

    profileId:null,





    getUsers: async()=>{
        set({isUsersLoading: true});
        try{
          
            const token=localStorage.getItem('token');
            if(!token){
                alert("no token");
                return;
            }
            const res=await api.get(`/messages/getusers`,{
            
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
            
            set({users:res.data});

        }
        catch(e){
            toast.error(e.message || "error");
            set({ users: [] });

        }
        finally{
            set({isUsersLoading: false});
        }
    },

    getMessages: async(userId) => {
        set({isMessagesLoading: true});
        try{
            const token=localStorage.getItem('token');
              if(!token){
                alert("no token");
                return;
            }
            const res=await api.get(`/messages/get/${userId}`,{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            });
      
            set({ messages: Array.isArray(res.data) ? res.data: [] });

        }
        catch(e){
            toast.error("error while getting messages!");
            set({ messages: [] }); 
        }
        finally{
            set({isMessagesLoading: false});
        }
    },

    sendMessages: async(messageData)=>{
        const {selectedUser,messages}=get();

        

        try{
            console.log("checking msg at star5t");
            console.log(messages);
            const token=localStorage.getItem('token');
              if(!token){
                alert("no token");
                return;
            }
            const res=await api.post(`/messages/send/${selectedUser._id}`,messageData,{
            
                headers: {
                  Authorization: `Bearer ${token}`,
                },

              });

       
            set({messages:[...messages,res.data]})

            //start ntifictaion
            // const token=localStorage.getItem('token');
            // if(!token)
            //   return;
            // const decoded = jwtDecode(token);
            // const userId = decoded.userId;
            // await axios.post("/send-notification",
            //   {
            //     userId: selectedUser._id,    // The owner of the post
            //     senderId: userId,         // The person who commented
            //     type: "Message Notification",
            //     title: "Message",
            //     body: "Messaged you",    // Send the comment text as notification body
            //   },
            //   {
            //     headers: {
            //       "Content-Type": "application/json",
            //       Authorization: `Bearer ${token}`,
            //     }
            //   }
            // );
      
            // console.log("✅ View Notification Sent Successfully");
     



        }

        catch(e){
            // console.log("error is");
            console.log(e);
            toast.error("error sending the message");
            // toast.error(e.message);

        }
    },

    subscribeToMessages: (socket) => {
        const {selectedUser} = get();
        if(!selectedUser || !socket) return;

        socket.on("newMessage",(newMessage) => {
            const {messages} = get();
            set((state) => ({
                messages:[...messages,newMessage],
            })); 
        });

        

    }, 

    unsubscribeFromMessages:(socket) =>{
        socket?.off("newMessage");
    }, 


    // Notifications polling every 5 seconds
    // getNotifications: async () => {
    //     try {
    //         const token = localStorage.getItem("token");
    //         if(!token) return;
    //         // const decoded = jwtDecode(token);
    //         let decoded;
    //         try {
    //             decoded = jwtDecode(token);
    //         } catch (error) {
    //             console.error("Invalid token:", error);
    //             return;
    //         }
    //         const userId = decoded.userId;
    //         const res = await axios.get(`/notifications/getall/${userId}`, {
    //             headers: { Authorization: `Bearer ${token}` },
    //         });
            

    //         console.log("updated notifications")
    //         console.log(res.data);
    //         set({ notifications: res.data }); 
           
    //     } catch (e) {
    //         console.error("Error fetching notifications", e);
    //     }
    // },


    // removeNotification: (id) => {
    //     set((state) => ({
    //         notifications: state.notifications.filter(n => n._id !== id)
    //     }));
    // },


    // startNotificationPolling: () => {
    //     get().getNotifications(); // ✅ Fetch once immediately before polling starts
    
    //     const intervalId = setInterval(() => {
    //         get().getNotifications();
    //     }, 5000);
    
    //     set({ notificationPollingInterval: intervalId });
    // },
    

    // stopNotificationPolling: () => {
    //     const { notificationPollingInterval } = get();
    //     if (notificationPollingInterval) {
    //         clearInterval(notificationPollingInterval);
    //         set({ notificationPollingInterval: null });
    //     }
    // },


    //optimise this one later
    setSelectedUser:(selectedUser)=> set({selectedUser}),
    setChatUserId: (chatUserId) => set({ chatUserId }),
    setProfileId:(profileId) => set({ profileId }),

    clearUsers: () => {
        set({ users: [], selectedUser: null });
        console.log("clearing Users");
        },
    clearMessages: () => set({ messages: [] })
    
}));
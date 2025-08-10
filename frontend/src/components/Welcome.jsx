import React from 'react';
import {useEffect} from "react";
import { useNavigate } from 'react-router-dom';
import { useSocket } from './useSocket';
import axios from "axios";

// import { messaging, getToken } from './notifications/firebase.js';
// import {  onMessage } from './notifications/firebase';


const WelcomeOverlay = () => {
    const navigate = useNavigate();
    const { user, setUser, socket, connectSocket } = useSocket();
    const renderurl="https://socialmedia-backend-2njs.onrender.com";
 
 

    // onMessage(messaging, (payload) => {
    //     console.log('Notification received:', payload);
    //     alert(payload.notification.title + '\n' + payload.notification.body);
    //   });

    //   useEffect(() => {
    //     const requestPermission = async () => {
    //       console.log('🔹 Requesting permission for notifications...');
    //       const permission = await Notification.requestPermission();
    //       if (permission === 'granted') {
    //         console.log('✅ Notification permission granted');
    
    //         try {
    //           // 🔹 Get FCM Token
    //           const token = await getToken(messaging, { vapidKey: 'BIWYQ0KsMfECUsw5MC85iKTB6OGDQpP4p-lhZLFmHpyk9JS-6d5k2A_41do5zdbzkqe8ikyeMwRy6wo33nKisl4' });
    //           console.log('✅ FCM Token:', token);
    
    //           // 🔹 Send token to backend
    //           await axios.post('http://localhost:7000/update-fcm-token', {
    //             userId,
    //             token,
    //           });
    
    //           console.log('✅ FCM Token sent to backend!');
    //         } catch (error) {
    //           console.error('🚨 Error getting FCM token:', error);
    //         }
    //       } else {
    //         console.warn('🚨 Notification permission denied');
    //       }
    //     };
    
    //     requestPermission();
    //   }, []);

 
 
 
 
 
    function onRegister() {
        navigate(`/register`);
    }

    function onLogin() {
        navigate('/login');
    }

  const checkUser=async ()=>{
    const token=localStorage.getItem("token");
    if(token){
        axios.get(`/verify`,{
            headers: {Authorization:`Bearer ${token}` },
        })
        .then((res)=> {
            // setUser(res.data.user);
            navigate('/home');
            console.log("success");
        })
        .catch((e) => {
            // setUser(null);
        
            localStorage.removeItem('token');
        })
        
    }
    else{
        console.log("no token");
    }
  }

    useEffect(()=>{
        checkUser();
    },[])

    return (
        <div className="relative w-screen h-screen flex items-center justify-center bg-gray-800 text-white p-4 sm:p-8">
            <div className="max-w-3xl text-center space-y-4">
                <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 text-purple-400">
                    Friendsbook
                </h1>
                <p className="text-base sm:text-lg mb-4">
                    Friendsbook is the ultimate college network, connecting you to everyone that matters at MIT University and beyond!
                </p>
                <p className="text-base sm:text-lg mb-6">
                    We’ve opened up Friendsbook to MIT University – a space where every student can share their experiences, connect with friends, and dive into the social scene like never before.
                </p>
                <div className="text-left mb-6 space-y-3 text-sm sm:text-lg">
                    <p>
                        <span className="font-semibold text-purple-400">Be Yourself:</span> Share your college experiences with the entire campus on Friendsbook.
                    </p>
                    <p>
                        <span className="font-semibold text-purple-400">Find Your People:</span> Whether it’s friends, that special someone, or classmates, Friendsbook makes it easy to connect.
                    </p>
                    <p>
                        <span className="font-semibold text-purple-400">Make Your Mark:</span> Get social, get noticed, and be unforgettable.
                    </p>
                </div>
                <p className="font-medium mb-6">Ready to join the network?</p>
                <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
                    <button
                        onClick={onRegister}
                        className="w-40 px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-full text-base sm:text-lg transition duration-300"
                    >
                        Register
                    </button>
                    <button
                        onClick={onLogin}
                        className="w-40 px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-full text-base sm:text-lg transition duration-300"
                    >
                        Log In
                    </button>
                </div>
                <p className="mt-6 text-xs sm:text-sm text-gray-400 italic">
                    A Friendsbook Production | Copyright © 2024
                </p>
            </div>
        </div>
    );
};

export default WelcomeOverlay;

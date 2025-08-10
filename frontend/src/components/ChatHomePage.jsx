import {useChatStore} from './useChatStore';
import {useEffect, useContext} from "react";
import NoChatSelected from "./skeletons/NoChatSelected";
import Sidebar from "./Sidebar";
import ChatContainer from "./ChatContainer";
import api from "../api/api";
import { useSocket } from './useSocket';
import { useNavigate } from 'react-router-dom';
import { FiLogOut } from "react-icons/fi";
import { AuthContext } from "./AuthContext";

const ChatHomePage=()=>{
    const {selectedUser,resetState} = useChatStore();
    const {user,setUser,socket,connectSocket}= useSocket();

    const { token, authuser } = useContext(AuthContext);

    
    const navigate = useNavigate();
    async function getUser(){
        try{
           
            if(!token){
                alert("no token");
                return;
            }
            const res=await api.get(`/user/getUser`,{
                headers: {
                    Authorization:`Bearer ${token}`,
                },

            })
            
            setUser(res.data);
        }
        catch(e){
            console.log(e);
        }
    }

    useEffect(()=>{
    
    
        getUser();
    },[]);

    return(
        <div className="h-screen bg-base-200">
            {/* //added  */}

            <div className="absolute top-4 left-4">
                <button
                    className="btn btn-ghost btn-circle text-error"
                    onClick={() => navigate('/home')} 
                >
                    <FiLogOut size={25}   style={{ transform: 'scaleX(-1)' }}/>
                </button>
            </div>

            {/* //added */}
            <div className="flex items-center justify-center pt-20 px-4">
                <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
                    <div className="flex h-full rounded-lg overflow-hidden">
                        <Sidebar/>

                        {!selectedUser ? <NoChatSelected /> : <ChatContainer />}




                    </div>
                </div>
            </div>


        </div>
    )
}

export default ChatHomePage;
import React, { useEffect, useContext } from "react";
import { useChatStore } from './useChatStore';
import NoChatSelected from "./skeletons/NoChatSelected";
import Sidebar from "./Sidebar";
import ChatContainer from "./ChatContainer";
import AppLayout from "./AppLayout";
import api from "../api/api";
import { useSocket } from './useSocket';
import { AuthContext } from "./AuthContext";

const ChatHomePage = () => {
  const { selectedUser, resetState } = useChatStore();
  const { setUser } = useSocket();
  const { token } = useContext(AuthContext);

  async function getUser() {
    try {
      if (!token) return;
      const res = await api.get(`/user/getUser`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(res.data);
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    getUser();
  }, []);

  return (
    <AppLayout mainClassName="overflow-hidden h-full flex flex-col">
      <div className="h-full w-full overflow-hidden flex items-center justify-center p-0 md:p-4 bg-gray-100">
        <div className="bg-white rounded-none md:rounded-lg shadow-sm border-t md:border border-gray-200 w-full max-w-6xl h-full md:h-[calc(100vh-110px)] overflow-hidden">
          <div className="flex h-full overflow-hidden">
            {/* Contacts Sidebar */}
            <div className={`${selectedUser ? 'hidden md:block' : 'w-full md:w-64 lg:w-80'} h-full border-r border-gray-200 flex-shrink-0`}>
              <Sidebar />
            </div>

            {/* Chat Container */}
            <div className={`${!selectedUser ? 'hidden md:block' : 'w-full'} flex-grow h-full`}>
              {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ChatHomePage;
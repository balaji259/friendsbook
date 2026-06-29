import React, { useEffect, useState, useContext } from "react";
import AppLayout from "./AppLayout";
import Quote from "./Quote.jsx";
import FetchFriends from "./FetchFriends.jsx";
import { useSocket } from "./useSocket";
import api from "../api/api";
import { AuthContext } from "./AuthContext";
import { useChatStore } from "./useChatStore";

const Friends = () => {
  const { authuser } = useContext(AuthContext);
  const { setUser } = useSocket();
  const [isLoading, setIsLoading] = useState(true); 
  const { setProfileId } = useChatStore();

  useEffect(() => {
    setProfileId(null);
    const getUser = async () => {
      try {
        const res = await api.get(`/user/getUser`);
        setUser(res.data);
      } catch (e) {
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    };

    getUser();
  }, [setUser]);

  if (isLoading) {
    return <Quote />;
  }

  return (
    <AppLayout>
      <div className="w-full flex justify-center py-4 px-2 sm:px-4">
        <FetchFriends />
      </div>
    </AppLayout>
  );
};

export default Friends;
import React, { useEffect } from 'react';
import AppLayout from './AppLayout';
import Details from './Details';
import { useSocket } from "./useSocket";
import axios from "axios";

const Profile = () => {
  const { setUser } = useSocket();

  async function getUser() {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`/user/getUser`, {
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
    <AppLayout>
      <div className="w-full flex justify-center py-4 px-2 sm:px-4">
        <Details />
      </div>
    </AppLayout>
  );
};

export default Profile;
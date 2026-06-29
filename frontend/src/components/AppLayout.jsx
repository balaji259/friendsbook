import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Dashboard from "./Dashboard";
import { AuthContext } from "./AuthContext";
import api from "../api/api";
import Quote from "./Quote";

const AppLayout = ({ children, mainClassName = "overflow-y-auto" }) => {
  const { token, authuser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState({ username: "", profilePic: "" });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    const getUserDetails = async () => {
      try {
        const response = await api.get(`/user/getdetails`);
        if (response.data) {
          setCurrentUser({
            username: response.data.username,
            profilePic: response.data.profilePic,
          });
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getUserDetails();
  }, [token, navigate]);

  if (isLoading) {
    return <Quote />;
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-100 font-sans">
      {/* Top Navbar */}
      <Navbar username={currentUser.username} profilePic={currentUser.profilePic} />

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden mt-[60px] mb-16 md:mb-0">
        {/* Left Sidebar (Desktop only) */}
        <aside className="hidden md:block md:w-56 lg:w-64 flex-shrink-0 border-r border-gray-200 overflow-y-auto bg-gray-50">
          <Dashboard isMobile={false} />
        </aside>

        {/* Content Panel */}
        <main className={`flex-1 bg-gray-100 ${mainClassName}`}>
          {children}
        </main>
      </div>

      {/* Bottom Nav Bar (Mobile only) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200 z-50">
        <Dashboard isMobile={true} />
      </nav>
    </div>
  );
};

export default AppLayout;

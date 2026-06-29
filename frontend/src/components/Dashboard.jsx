
import React, { useState, useContext, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from 'react-hot-toast';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faUser, 
  faMessage, 
  faUserGroup, 
  faKey, 
  faArrowRightFromBracket, 
  faNewspaper, 
  faCommentDots,
  faBars
} from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "./AuthContext";
import { useSocket } from "./useSocket";

const Dashboard = ({ isMobile }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { socket, disconnectSocket } = useSocket();
  const { setToken, setAuthUser } = useContext(AuthContext);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const moreMenuRef = useRef(null);

  const handleLogout = () => {
    if (socket) {
      disconnectSocket();
    }
    setToken(null);
    setAuthUser(null);
    localStorage.clear();
    navigate("/");
  };

  // Close more menu if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target)) {
        setShowMoreMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActive = (path) => location.pathname === path;

  if (isMobile) {
    return (
      <div className="flex justify-around items-center w-full h-full px-2 relative bg-white border-t border-gray-250 shadow-lg">
        {/* Feed */}
        <button 
          onClick={() => navigate("/home")}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
            isActive("/home") ? "text-blue-600 font-semibold" : "text-gray-500 hover:text-gray-800"
          }`}
        >
          <FontAwesomeIcon icon={faNewspaper} className="text-xl mb-0.5" />
          <span className="text-[10px]">Feed</span>
        </button>

        {/* Friends */}
        <button 
          onClick={() => navigate("/search")}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
            isActive("/search") ? "text-blue-600 font-semibold" : "text-gray-500 hover:text-gray-800"
          }`}
        >
          <FontAwesomeIcon icon={faUserGroup} className="text-xl mb-0.5" />
          <span className="text-[10px]">Friends</span>
        </button>

        {/* Chats */}
        <button 
          onClick={() => navigate("/chats")}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
            isActive("/chats") ? "text-blue-600 font-semibold" : "text-gray-500 hover:text-gray-800"
          }`}
        >
          <FontAwesomeIcon icon={faMessage} className="text-xl mb-0.5" />
          <span className="text-[10px]">Chats</span>
        </button>

        {/* Profile */}
        <button 
          onClick={() => navigate("/profile")}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
            isActive("/profile") ? "text-blue-600 font-semibold" : "text-gray-500 hover:text-gray-800"
          }`}
        >
          <FontAwesomeIcon icon={faUser} className="text-xl mb-0.5" />
          <span className="text-[10px]">Profile</span>
        </button>

        {/* More Menu Trigger */}
        <button 
          onClick={() => setShowMoreMenu(!showMoreMenu)}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
            showMoreMenu ? "text-blue-600 font-semibold" : "text-gray-500 hover:text-gray-800"
          }`}
        >
          <FontAwesomeIcon icon={faBars} className="text-xl mb-0.5" />
          <span className="text-[10px]">More</span>
        </button>

        {/* More Menu Dropdown Overlay */}
        {showMoreMenu && (
          <div 
            ref={moreMenuRef}
            className="absolute bottom-16 right-4 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200"
          >
            <button 
              onClick={() => { navigate('/key/management'); setShowMoreMenu(false); }}
              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left"
            >
              <FontAwesomeIcon icon={faKey} className="text-gray-400 w-4" />
              <span>Key Management</span>
            </button>
            <button 
              onClick={() => { navigate('/feedback'); setShowMoreMenu(false); }}
              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left"
            >
              <FontAwesomeIcon icon={faCommentDots} className="text-gray-400 w-4" />
              <span>Send Feedback</span>
            </button>
            <hr className="my-1 border-gray-100" />
            <button 
              onClick={() => { handleLogout(); setShowMoreMenu(false); }}
              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium text-left"
            >
              <FontAwesomeIcon icon={faArrowRightFromBracket} className="text-red-400 w-4" />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  // Desktop view (left sidebar)
  return (
    <div className="flex flex-col h-full bg-gray-50 justify-between p-4 border-r border-gray-200">
      <div className="flex flex-col gap-2">
        {/* Feed */}
        <button 
          onClick={() => navigate("/home")}
          className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
            isActive("/home") 
              ? "bg-blue-50 text-blue-700 font-semibold shadow-sm" 
              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          }`}
        >
          <FontAwesomeIcon icon={faNewspaper} className="w-5 text-lg" />
          <span>Feed</span>
        </button>

        {/* Friends */}
        <button 
          onClick={() => navigate("/search")}
          className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
            isActive("/search") 
              ? "bg-blue-50 text-blue-700 font-semibold shadow-sm" 
              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          }`}
        >
          <FontAwesomeIcon icon={faUserGroup} className="w-5 text-lg" />
          <span>Friends</span>
        </button>

        {/* Chats */}
        <button 
          onClick={() => navigate("/chats")}
          className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
            isActive("/chats") 
              ? "bg-blue-50 text-blue-700 font-semibold shadow-sm" 
              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          }`}
        >
          <FontAwesomeIcon icon={faMessage} className="w-5 text-lg" />
          <span>Chats</span>
        </button>

        {/* Key */}
        <button 
          onClick={() => navigate("/key/management")}
          className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
            isActive("/key/management") 
              ? "bg-blue-50 text-blue-700 font-semibold shadow-sm" 
              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          }`}
        >
          <FontAwesomeIcon icon={faKey} className="w-5 text-lg" />
          <span>Key Management</span>
        </button>

        {/* Feedback */}
        <button 
          onClick={() => navigate("/feedback")}
          className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
            isActive("/feedback") 
              ? "bg-blue-50 text-blue-700 font-semibold shadow-sm" 
              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          }`}
        >
          <FontAwesomeIcon icon={faCommentDots} className="w-5 text-lg" />
          <span>Feedback</span>
        </button>

        {/* Profile */}
        <button 
          onClick={() => navigate("/profile")}
          className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
            isActive("/profile") 
              ? "bg-blue-50 text-blue-700 font-semibold shadow-sm" 
              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          }`}
        >
          <FontAwesomeIcon icon={faUser} className="w-5 text-lg" />
          <span>Profile</span>
        </button>
      </div>

      {/* Logout */}
      <button 
        onClick={handleLogout}
        className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors mt-auto"
      >
        <FontAwesomeIcon icon={faArrowRightFromBracket} className="w-5 text-lg" />
        <span>Logout</span>
      </button>
    </div>
  );
};

export default Dashboard;

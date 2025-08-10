import React from "react";
import {useNavigate} from "react-router-dom";

const BlogPage = () => {

  const navigate=useNavigate();

  return (
    <div className="font-sans min-h-screen bg-white p-4 flex flex-col">
      {/* Header */}
      <header className="bg-[#3b5998] p-3 flex justify-between items-center text-white text-xs">
        <div></div>
        <nav className="flex gap-3">
          {/* <p href="#" className="hover:underline">Login</p>
          <p href="#" className="hover:underline">Register</p> */}
          <p className="cursor-pointer text-white" onClick={()=>{navigate('/newlogin')}}>Login/Register</p>
          <p className="text-white" onClick={()=>{navigate("/contact")}}>Help</p>
        </nav>
      </header>

      <div className="flex flex-1 flex-col md:flex-row mt-4">
        {/* Left Sidebar (Hidden on Small Screens) */}
        <div className="w-full md:w-1/4 p-4 md:block">
          
          <div className="text-sm">
            <div className="mb-2">
              <a href="#" className="text-[#3b5998]">▶ Register</a>
              <div className="text-gray-600 ml-3">Everyone can join.</div>
            </div>
            <div>
              <a href="#" className="text-[#3b5998]">▶ Site Tour</a>
              <div className="text-gray-600 ml-3">Learn about Friendsbook.</div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-4">
          <div className="bg-[#3b5998] text-white p-3 text-sm font-bold flex justify-center md:justify-start">
            Friendsbook Blog
          </div>
          <div className="p-4 text-sm">
            <div className="flex justify-between mb-4">
              <span>Friendsbook Blog home</span>
              <div className="flex gap-2">
                <a href="#" className="text-blue-700">Previous</a>
                <a href="#" className="text-blue-700">Next</a>
              </div>
            </div>
            {/* Content Placeholder */}
            <p className="text-gray-700">
              Blog content will appear here...
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default BlogPage;

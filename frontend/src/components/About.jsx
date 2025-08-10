import React from "react";
import { useNavigate } from "react-router-dom";

const About = () => {

  const navigate=useNavigate();

  return (
    <div className="bg-white font-sans min-h-screen">
      {/* Header */}
      <div className="bg-[#3b5998] relative overflow-hidden">
     
        <div className="relative z-10 max-w-6xl mx-auto flex justify-between items-center p-4">
          <a href="/" className="text-white text-2xl font-bold">friendsbook</a>
          <div className="hidden md:flex space-x-4">
            {/* <a href="/login" className="text-white text-sm">login</a>
            <a href="/register" className="text-white text-sm">register</a> */}
            <p  className="cursor-pointer text-white" onClick={()=>{navigate('/newlogin')}}>Login/Register</p>
            <p  className="cursor-pointer text-white" onClick={()=>{navigate('/blog')}}>Blog</p>
            <p  className="cursor-pointer text-white" onClick={()=>{navigate('/faq')}}>Faq</p>
          </div>
        </div>
      </div>

      {/* Main Section: Login & About Side by Side */}
      <div className="max-w-6xl mx-auto mt-10 px-4">
        <div className="flex flex-col md:flex-row items-start gap-8">
          {/* Login Section */}
          {/* <div className="md:w-1/3 w-full">
            <div className="bg-gray-100 p-6 rounded shadow-lg">
              <h2 className="text-lg font-bold mb-4">Login to Friendsbook</h2>
              <form>
                <label className="block text-sm mb-1">Email:</label>
                <input type="text" className="w-full p-2 mb-3 border rounded" />
                <label className="block text-sm mb-1">Password:</label>
                <input type="password" className="w-full p-2 mb-3 border rounded" />
                <div className="flex gap-2">
                  <button type="submit" className="bg-blue-800 text-white px-4 py-2 text-sm rounded">Login</button>
                  <button type="button" className="bg-blue-800 text-white px-4 py-2 text-sm rounded">Register</button>
                </div>
              </form>
            </div>
          </div> */}

          {/* About Section */}
          <div className="md:w-2/3 w-full">
            <h2 className="text-2xl font-bold mb-4">About Friendsbook</h2>

            <div className="mb-6">
              <div className="bg-[#3b5998] text-white p-2 font-bold">The Project</div>
              <div className="p-4 border border-[#3b5998]">
                Friendsbook is an online directory that connects people through social networks at colleges and universities.
              </div>
            </div>

            <div className="mb-6">
              <div className="bg-[#3b5998] text-white p-2 font-bold">The People</div>
              <div className="p-4 border border-blue-800">
                <div className="mb-2">
                  <span className="text-[#3b5998] font-semibold">Pranav Kavade</span>
                  <span className="ml-2 text-black">Founder.</span>
                </div>
                <div className="mb-2">
                  <span className="text-[#3b5998] font-semibold">Balaji</span>
                  <span className="ml-2 text-black">Programmer, Assassin.</span>
                </div>
                <div>
                  <a href="/contact" className="text-blue-600 underline">Contact us.</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;

import React from "react";

const Create= () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation Bar */}
      <nav className="bg-[#3b5998] shadow-md p-4 flex justify-between items-center">
        <a href="#" className="text-xl font-bold text-white">FriendsBook</a>
        <input
          type="text"
          placeholder="Search FriendsBook"
          className="border rounded-full px-4 py-2 w-1/3 focus:outline-none"
        />
        <div className="space-x-4">
          <a href="#" className="text-white">Home</a>
          <a href="#" className="text-white">Profile</a>
          <a href="#" className="text-white">Messages</a>
          <a href="#" className="text-white">Notifications</a>
        </div>
      </nav>

      {/* Main Layout */}
      <div className="flex p-4">
        {/* Left Sidebar */}
        <aside className="w-1/5 bg-white p-4 shadow-md">
          <ul className="space-y-2">
            {[
              "News Feed",
              "Messages",
              "Events",
              "Groups",
              "Pages",
              "Communities",
              "Photos",
              "Marketplace",
            ].map((item) => (
              <li key={item} className="hover:bg-gray-200 p-2 rounded">
                <a href="#" className="block text-gray-700">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </aside>

        {/* Main Content */}
        <main className="flex-1 bg-white p-6 shadow-md mx-4">
          <h1 className="text-2xl font-bold">Create a Page</h1>
          <p className="text-gray-600">Create a page for your organization or interest group.</p>

          <form className="mt-4">
            <div className="mb-4">
              <label className="block font-semibold">Page Name*</label>
              <input
                type="text"
                required
                placeholder="Enter page name"
                className="w-full border p-2 rounded mt-1"
              />
            </div>
            
            <div className="mb-4">
              <label className="block font-semibold">Category*</label>
              <select className="w-full border p-2 rounded mt-1">
                <option>Select a category</option>
                <option>Academic Club</option>
                <option>Sports Team</option>
                <option>Student Organization</option>
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block font-semibold">Description</label>
              <textarea
                className="w-full border p-2 rounded mt-1"
                placeholder="Tell people what your page is about"
              ></textarea>
            </div>

            <div className="mb-4">
              <label className="block font-semibold">Profile Picture</label>
              <input type="file" className="w-full border p-2 rounded mt-1" />
            </div>
            
            <div className="mb-4">
              <label className="block font-semibold">Cover Photo</label>
              <input type="file" className="w-full border p-2 rounded mt-1" />
            </div>

            <h3 className="font-semibold">Page Permissions</h3>
  <div className="mb-4 space-y-2">
    <label className="block">
      <input type="checkbox" defaultChecked /> Allow members to post on the page
    </label>
    <label className="block">
      <input type="checkbox" defaultChecked /> Allow comments on posts
    </label>
    <label className="block">
      <input type="checkbox" /> Require admin approval for posts
    </label>
  </div>

  <h3 className="font-semibold">Privacy Settings</h3>
  <div className="mb-4">
    <label className="block font-semibold">Who can see this page?</label>
    <select className="w-full p-2 border rounded-md">
      <option value="public">Public - Anyone can see the page</option>
      <option value="college">College Only - Only people from your college</option>
      <option value="members">Members Only - Only members can see content</option>
    </select>
  </div>

  <div className="mb-4">
    <label className="block font-semibold">Who can join this page?</label>
    <select className="w-full p-2 border rounded-md">
      <option value="anyone">Anyone can join</option>
      <option value="approval">Admin approval required</option>
      <option value="invitation">By invitation only</option>
    </select>
  </div>

            {/* <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
              Create Page
            </button> */}


<div className="flex justify-start gap-4 mt-4">
    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md">Create Page</button>
    <button type="button" className="bg-gray-400 text-white px-4 py-2 rounded-md">Cancel</button>
  </div>

          </form>
        </main>

        {/* Right Sidebar */}
        <aside className="w-1/5 bg-white p-4 shadow-md">
          <h3 className="font-bold">Tips for Creating a Successful Page</h3>
          <ul className="mt-2 text-gray-600 text-sm">
            <li>- Choose a clear, descriptive name</li>
            <li>- Upload a recognizable profile picture</li>
            <li>- Write a complete description</li>
            <li>- Invite friends from your college</li>
            <li>- Post regularly to keep members engaged</li>
          </ul>
        </aside>
      </div>
    </div>
  );
};

export default Create;

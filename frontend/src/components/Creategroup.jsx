import React, { useState } from "react";
import { jwtDecode } from "jwt-decode";
import {useNavigate} from "react-router-dom";


const CreateGroup = () => {

  const navigate=useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    profilePicture: null,
    coverPhoto: null,
    allowPosts: true,
    allowComments: true,
    requireApproval: false,
    visibility: "public",
    joinMethod: "anyone",
  });

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: files.length > 0 ? files[0] : null, // Ensure a file is selected
      }));
    } else if (type === "checkbox") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: checked,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token=localStorage.getItem('token');
    if(!token)
    {
      alert("Please login first");
    }

    const decoded=jwtDecode(token);
    const userId=decoded.userId;
    // console.log("userId:",userId);

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null && formData[key] !== "") {
        formDataToSend.append(key, formData[key]);
      }
    });

    formDataToSend.append("createdBy",userId);

    try {
      console.log("FormData being sent:");
      for (let pair of formDataToSend.entries()) {
        console.log(pair[0] + ": " + pair[1]); // Log the form data being sent
      }

      const response = await fetch("/group/create", {
        method: "POST",
        body: formDataToSend,
      });

      console.log("response");
      console.log(response);


      const result = await response.json();
      if (response.ok) {
        alert("Page created successfully!");
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to create the page.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-[#3b5998] shadow-md p-4 flex justify-between items-center">
        <a href="#" className="text-xl font-bold text-white">FriendsBook</a>
        <input
          type="text"
          placeholder="Search FriendsBook"
          className="border rounded-full px-4 py-2 w-1/3 focus:outline-none"
        />
        <div className="space-x-4">
          <a  className="text-white cursor-pointer" onClick={()=>{navigate('/home')}}>Home</a>
          <a  className="text-white cursor-pointer" onClick={()=>{navigate('/newprofile')}}>Profile</a>
          <a  className="text-white cursor-pointer" onClick={()=>{navigate('/chats')}}>Messages</a>
          <a  className="text-white cursor-pointer" onClick={()=>{navigate('/notifications')}}>Notifications</a>
        </div>
      </nav>

      <div className="flex p-4">
        <aside className="w-1/5 bg-white p-4 shadow-md">
          <ul className="space-y-2">
            {["News Feed", "Messages", "Events", "Groups", "Pages", "Communities", "Photos", "Marketplace"].map((item) => (
              <li key={item} className="hover:bg-gray-200 p-2 rounded">
                <a href="#" className="block text-gray-700">{item}</a>
              </li>
            ))}
          </ul>
        </aside>

        <main className="flex-1 bg-white p-6 shadow-md mx-4">
          <h1 className="text-2xl font-bold">Create a Group</h1>
          <p className="text-gray-600">Create a Group for your organization or interest group.</p>

          <form className="mt-4" onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block font-semibold">Group Name*</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full border p-2 rounded mt-1" />
            </div>

            <div className="mb-4">
              <label className="block font-semibold">Category*</label>
              <select name="category" value={formData.category} onChange={handleChange} className="w-full border p-2 rounded mt-1">
                <option value="">Select a category</option>
                <option>Academic Club</option>
                <option>Sports Team</option>
                <option>Student Organization</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block font-semibold">Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} className="w-full border p-2 rounded mt-1" placeholder="Tell people what your page is about"></textarea>
            </div>

            <div className="mb-4">
              <label className="block font-semibold">Profile Picture</label>
              <input type="file" name="profilePicture" onChange={handleChange} className="w-full border p-2 rounded mt-1" />
            </div>

            <div className="mb-4">
              <label className="block font-semibold">Cover Photo</label>
              <input type="file" name="coverPhoto" onChange={handleChange} className="w-full border p-2 rounded mt-1" />
            </div>

            <h3 className="font-semibold">Page Permissions</h3>
            <div className="mb-4 space-y-2">
              <label className="block">
                <input type="checkbox" name="allowPosts" checked={formData.allowPosts} onChange={handleChange} /> Allow members to post on the page
              </label>
              <label className="block">
                <input type="checkbox" name="allowComments" checked={formData.allowComments} onChange={handleChange} /> Allow comments on posts
              </label>
              <label className="block">
                <input type="checkbox" name="requireApproval" checked={formData.requireApproval} onChange={handleChange} /> Require admin approval for posts
              </label>
            </div>

            <h3 className="font-semibold">Privacy Settings</h3>
            <div className="mb-4">
              <label className="block font-semibold">Who can see this page?</label>
              <select name="visibility" value={formData.visibility} onChange={handleChange} className="w-full p-2 border rounded-md">
                <option value="public">Public - Anyone can see the page</option>
                <option value="college">College Only - Only people from your college</option>
                <option value="members">Members Only - Only members can see content</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block font-semibold">Who can join this page?</label>
              <select name="joinMethod" value={formData.joinMethod} onChange={handleChange} className="w-full p-2 border rounded-md">
                <option value="anyone">Anyone can join</option>
                <option value="approval">Admin approval required</option>
                <option value="invitation">By invitation only</option>
              </select>
            </div>

            <div className="flex justify-start gap-4 mt-4">
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md">Create Page</button>
              <button type="button" className="bg-gray-400 text-white px-4 py-2 rounded-md">Cancel</button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};

export default CreateGroup;

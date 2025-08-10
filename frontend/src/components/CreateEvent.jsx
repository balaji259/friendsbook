import { useState } from "react";
import axios from "axios";
import { toast } from 'react-hot-toast';
import { useParams, useNavigate } from "react-router-dom";

export default function CreateEvent() {
  const { id } = useParams(); // this assumes your route is set like /community/:communityId/sections

  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [message, setMessage] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);

  const navigate=useNavigate();

  const tags = [
    "Party",
    "Meeting",
    "Study",
    "Sports",
    "Music",
    "Art",
    "Food",
    "Club",
    "Seminar",
  ];

  const toggleTag = (tag) => {
    setSelectedTags((prevTags) =>
      prevTags.includes(tag)
        ? prevTags.filter((t) => t !== tag)
        : [...prevTags, tag]
    );
  };





const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/events/create", {
        title,
        time,
        message,
        tags: selectedTags,
        cgId:id,
      });
  
      toast.success("🎉 Event created successfully!");
      
  
      // Reset form
      setTitle("");
      setTime("");
      setMessage("");
      setSelectedTags([]);

      navigate(-1);

    } catch (error) {
      if (error.response && error.response.data?.error) {
        toast.error(`❌ Error: ${error.response.data.error}`);
      } else {
        toast.error("❌ Server Error. Check console.");
      }
      console.error("Error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#f2f2f2] text-[#333] font-sans">
      {/* Header */}
      <nav className="bg-[#3b5998] h-12 fixed top-0 w-full shadow-md z-50">
        <div className="max-w-6xl mx-auto flex items-center h-full px-4">
          <a href="#" className="text-white text-lg font-bold">friendsbook</a>
          <div className="bg-white ml-4 px-3 h-7 flex items-center rounded-md w-72">
            <input
              type="text"
              placeholder="Search Groups"
              className="w-full outline-none text-sm"
            />
          </div>
          <div className="ml-auto flex space-x-4">
            <a onClick={()=>{navigate('/home')}} className="text-white text-sm font-semibold mr-4 ">Home</a>
            <a onClick={()=>{navigate('/profile')}} className="text-white text-sm font-semibold mr-4">Profile</a>
            {/* <a onClick={()=>{navigate('/chats')}} className="text-white text-sm font-semibold mr-4">Messages</a> */}
            {/* <a onClick={()=>{navigate('/notifications')}} className="text-white text-sm font-semibold mr-4">Notifications</a> */}
          </div>
        </div>
      </nav>
      {/* Main Form Container */}
      <div className="max-w-xl mx-auto my-5 bg-white border border-[#dddfe2] rounded shadow">
        <div className="bg-[#f5f6f7] px-4 py-2 border-b border-[#dddfe2]">
          <h1 className="text-[#1d2129] text-base font-semibold">Create New Event</h1>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-4">
            <label htmlFor="event-title" className="block font-bold text-xs text-[#666] mb-1">
              Event Title:
            </label>
            <input
              type="text"
              id="event-title"
              className="w-full p-2 text-sm border border-[#bdc7d8] rounded"
              placeholder="What's your event called?"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="event-time" className="block font-bold text-xs text-[#666] mb-1">
              Date and Time:
            </label>
            <input
              type="datetime-local"
              id="event-time"
              className="w-full p-2 text-sm border border-[#bdc7d8] rounded"
              required
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="event-message" className="block font-bold text-xs text-[#666] mb-1">
              Event Message:
            </label>
            <textarea
              id="event-message"
              className="w-full p-2 text-sm border border-[#bdc7d8] rounded resize-y min-h-[80px]"
              placeholder="Tell people about your event..."
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
          </div>

          <div className="mb-4">
            <label className="block font-bold text-xs text-[#666] mb-1">Tags:</label>
            <div className="flex flex-wrap gap-2 mt-1">
              {tags.map((tag) => (
                <div
                  key={tag}
                  className={`cursor-pointer px-2 py-1 text-sm rounded border ${
                    selectedTags.includes(tag)
                      ? "bg-[#4267b2] text-white border-[#29487d] hover:bg-[#365899]"
                      : "bg-[#e9ebee] border-[#dddfe2] hover:bg-[#dddfe2]"
                  }`}
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-3 mt-4 border-t border-[#dddfe2]">
            <button
              type="button"
              className="bg-[#f5f6f7] border border-[#ccd0d5] text-[#4b4f56] font-bold text-xs px-2 py-1 rounded mr-2 hover:bg-[#ebedf0]"
              onClick={() => {
                setTitle("");
                setTime("");
                setMessage("");
                setSelectedTags([]);
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[#5b74a8] border border-[#29447e] text-white font-bold text-xs px-2 py-1 rounded hover:bg-[#4e69a2]"
            >
              Create Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
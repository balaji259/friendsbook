import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from "../api/api";
import { AuthContext } from "./AuthContext";

const ReportPost = () => {
    
    const [postId, setPostId] = useState("");
    const [reason, setReason] = useState("");
      const { token, authuser } = useContext(AuthContext);

    const navigate = useNavigate();



    useEffect(() => {

        if(!authuser){
            navigate("/");
            return;
        }

        const urlParams = new URLSearchParams(window.location.search);
        setPostId(urlParams.get("postId") || "");
        
    }, []);


const handleReportSubmit = async (event) => {
  event.preventDefault();


  if (!token) {

    toast.error("Please log in to submit a report.", { duration: 2500 });
    return;
  }

  const userId = authuser.userId;
  const reportData = { userId, postId, reason };


  try {
    const response = await api.post(
      "/posts/report",
      reportData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (response.data.success) {
      toast.success("Report submitted successfully!", { duration: 2500 });

      setTimeout(() => {
        navigate("/home");
      }, 3000);
    } else {
      toast.error("Failed to submit report. Please try again.", {
        duration: 2500,
      });
    }
  } catch (error) {
    if (error.response?.status === 401) {
      console.error("Authentication failed. Please log in again.");
      toast.error("Please log in again.", { duration: 2500 });
    } else {
      console.error("Error:", error);
      toast.error("An error occurred. Please try again later.", {
        duration: 2500,
      });
    }
  }
};

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 via-cyan-500 to-yellow-200 p-5">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
                <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Report Post</h2>
                <form onSubmit={handleReportSubmit} className="flex flex-col">
                    <input type="hidden" value={authuser.userId} />
                    <input type="hidden" value={postId} />
                    
                    <label htmlFor="reason" className="text-lg font-medium text-gray-700 mb-2">Reason for Reporting:</label>
                    <textarea
                        id="reason"
                        name="reason"
                        placeholder="Describe why you're reporting this post..."
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        required
                        className="resize-y p-3 text-gray-800 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 mb-4 min-h-[100px]"
                    />
                    
                    <button
                        type="submit"
                        className="bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 transition-colors"
                    >
                        Submit Report
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ReportPost;

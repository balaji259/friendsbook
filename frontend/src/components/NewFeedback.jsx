import { useState, useContext } from "react";
import { toast } from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { AuthContext } from "./AuthContext";

const NewFeedbackForm = () => {
  const [feedbackType, setFeedbackType] = useState("");
  const [feedbackPart, setFeedbackPart] = useState("");
  const [feedbackText, setFeedbackText] = useState("");
  const [includeSessionData, setIncludeSessionData] = useState(false);
  const [responseMessage, setResponseMessage] = useState(null); // State to store API response
  const [isError, setIsError] = useState(false); // State to track error
  // const [email,setEmail]=useState("");    
  const {token, authuser} = useContext(AuthContext);
  const navigate = useNavigate();

const {email} = authuser || { email: "" };

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!feedbackType) {
    toast.error("Please select the kind of feedback you have.");
    return;
  }
  if (!feedbackPart) {
    toast.error("Please select the part of Friendsbook you are giving feedback on.");
    return;
  }
  if (!feedbackText.trim()) {
    toast.error("Please describe your feedback.");
    return;
  }

  const feedbackData = {
    feedbackType,
    feedbackPart,
    feedbackText,
    includeSessionData: includeSessionData ? "Selected" : "Not Selected",
    email,
  };

  setResponseMessage(null);
  setIsError(false);

  try {
    const response = await api.post("/feedback/senddata", feedbackData);

    toast.success("Feedback sent successfully!");
    setResponseMessage("Feedback sent successfully!");
    setIsError(false);

    setFeedbackType("");
    setFeedbackPart("");
    setFeedbackText("");
    setIncludeSessionData(false);
  } catch (error) {
    setResponseMessage("Error submitting feedback. Please try again.");
    setIsError(true);
    toast.error("Error submitting feedback. Please try again!");
  }
};


  return (


    <div className="min-h-screen bg-gray-200">
    {/* Navbar */}
    <nav className="bg-[#3B5998] text-white p-4 flex items-center justify-between shadow-md">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)} 
          className="text-white font-medium text-md hover:bg-[#1d325e] px-3 py-1 rounded-md flex items-center gap-2 transition duration-200"
          title="Go Back"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <div className="text-xl font-bold">friendsbook</div>
      </div>
    </nav>


    <div className="flex items-center justify-center min-h-screen bg-gray-200">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg">
        <h2 className="text-2xl font-semibold mb-4">Send Feedback</h2>
        <p className="text-gray-600 text-sm mb-4">
          We’re always working to improve Friendsbook and your feedback helps us make it better
          for everyone. Let us know what’s working and what isn’t.
        </p>
        

        <form onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-gray-700">What kind of feedback do you have?</label>
          <select
            className="w-full p-2 border rounded mt-1 mb-4"
            value={feedbackType}
            onChange={(e) => setFeedbackType(e.target.value)}
          >
            <option value="">Please select</option>
            <option value="Suggestion">Suggestion</option>
            <option value="Something not working">Something isn't working</option>
            <option value="Compliment">Compliment</option>
            <option value="Other">Other</option>
          </select>

          <label className="block text-sm font-medium text-gray-700">Which part of Friendsbook are you giving feedback on?</label>
          <select
            className="w-full p-2 border rounded mt-1 mb-4"
            value={feedbackPart}
            onChange={(e) => setFeedbackPart(e.target.value)}
          >
            <option value="">Please select</option>
            <option value="Feed">Feed</option>
            <option value="Profile">Profile</option>
            <option value="Friends">Friends</option>
            <option value="Chats">Chats</option>
            <option value="Key">Key</option>
            <option value="Other">Other</option>
          </select>

          <label className="block text-sm font-medium text-gray-700">Your feedback:</label>
          <textarea
            className="w-full p-2 border rounded mt-1 mb-4"
            placeholder="Please describe your feedback in detail..."
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
          ></textarea>

          {/* <div className="flex items-center mb-4">
            <input
              type="checkbox"
              className="mr-2"
              checked={includeSessionData}
              onChange={() => setIncludeSessionData(!includeSessionData)}
              />
            <span className="text-sm text-gray-700">Include data about your current session to help us understand your feedback better (optional)</span>
          </div> */}

      

          <button
            type="submit"
            className="w-full bg-[#3b5998] text-white p-2 rounded hover:bg-blue-700 mb-4"
            >
            Submit Feedback
          </button>
      
              {/* {responseMessage && (
                <div
                  className={`p-3 text-center rounded-lg mb-4 ${
                    isError ? "bg-red-200 text-red-800" : "bg-green-200 text-green-800"
                  }`}
                >
                  {responseMessage}
                </div>
              )} */}
        </form>
      </div>
    </div>
    </div>
  );
};

export default NewFeedbackForm;

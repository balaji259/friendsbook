import { useState, useContext } from "react";
import { toast } from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { AuthContext } from "./AuthContext";
import AppLayout from "./AppLayout";

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
    <AppLayout>
      <div className="w-full flex justify-center py-6 px-2 sm:px-4">
        <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg border border-gray-200">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Send Feedback</h2>
          <p className="text-gray-600 text-sm mb-6">
            We’re always working to improve Friendsbook and your feedback helps us make it better
            for everyone. Let us know what’s working and what isn’t.
          </p>

          <form onSubmit={handleSubmit}>
            <label className="block text-sm font-medium text-gray-700">What kind of feedback do you have?</label>
            <select
              className="w-full p-2 border rounded mt-1 mb-4 focus:ring-1 focus:ring-blue-500 focus:outline-none"
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
              className="w-full p-2 border rounded mt-1 mb-4 focus:ring-1 focus:ring-blue-500 focus:outline-none"
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
              className="w-full p-2 border rounded mt-1 mb-4 focus:ring-1 focus:ring-blue-500 focus:outline-none h-32"
              placeholder="Please describe your feedback in detail..."
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
            ></textarea>

            <button
              type="submit"
              className="w-full bg-[#3b5998] text-white p-2.5 rounded hover:bg-blue-700 font-medium transition-colors"
            >
              Submit Feedback
            </button>
          </form>
        </div>
      </div>
    </AppLayout>
  );
};

export default NewFeedbackForm;

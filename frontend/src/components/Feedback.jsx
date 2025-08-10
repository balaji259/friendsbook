import { useState, useEffect, useContext } from "react";
import api from "../api/api";
import { AuthContext } from "./AuthContext";

export default function FeedbackForm() {

  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const {token, authuser} = useContext(AuthContext);
  const {email} = authuser;


  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");
    console.log("email");
    console.log(email);
    console.log("Feedback...");
    console.log(message);

    try {
  const response = await api.post(
    "/feedback/sendmail",
    { email, message },
    
  );

  if (response.status === 200) {
    setStatus("Feedback sent successfully!");
    setMessage("");
  } else {
    setStatus("Failed to send feedback. Try again.");
  }
} catch (error) {
  setStatus("Error sending feedback.");
}

  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-700 p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 text-center">Feedback Form</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            placeholder="Your Feedback"
            className="w-full p-2 border rounded-md"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          ></textarea>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
          >
            Send Feedback
          </button>
          {status && <p className="text-center text-sm text-gray-600">{status}</p>}
        </form>
      </div>
    </div>
  );
}

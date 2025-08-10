import React, { useState, useEffect } from "react";
import "./Quote.css";


const Quote = () => {
  const quotes = [
    "Swipe right on friendships, left on stress!",
    "College: Where sleep is optional, but FOMO is mandatory!",
    "Lecture? I thought you said adventure!",
    "Making memories, not just assignments!",
    "Loading... your next epic moment!",
    "Where WiFi is strong, and friendships are stronger!",
    "Post vibes, not just pictures!",
    "Friend requests > Exam requests!",
    "More streaks, fewer breaks!",
    "Your next best friend is one post away!"
  ];

  const [quote, setQuote] = useState("");

  useEffect(() => {
    // Set a random quote whenever the component mounts
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(randomQuote);
  }, []);

  return (
    <div className="loading-screen">
      <div className="loader"></div>
      <p className="quote">{quote}</p>
    </div>
  );
};

export default Quote;

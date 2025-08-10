// index.js
import { fetchUserDetails } from './userPosts.js'; // Adjust the path as necessary

document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  
  // Call the function to fetch user details
  fetchUserDetails(token);
});

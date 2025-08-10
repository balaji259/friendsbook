const renderurl="https://socialmedia-backend-2njs.onrender.com";
async function fetchUserDetails(token) {
    // Check if token is available
    if (!token) {
      alert("No token found. Please log in again.");
      return;
    }
  
    try {
      const response = await fetch(`/user/getdetails`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`, // Send token in Authorization header
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        
        // If you're managing state in a higher-level component, pass data to that component
        // For example
        return data; // You can return the user details if needed
      } else {
        alert("Failed to fetch user details.");
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      alert("Error fetching user details");
    }
  }
  
  function displayPosts(posts) {
    const postsContainer = document.getElementById("user-posts");
    postsContainer.innerHTML = "";
  
    posts.forEach((post) => {
      const postElement = document.createElement("div");
      postElement.classList.add("post");
  
      const postHeader = document.createElement("div");
      postHeader.classList.add("post-header");
      
      const caption = document.createElement("p");
      caption.textContent = post.captionOrText;
      postElement.appendChild(caption);
  
      if (post.mediaContent) {
        const media = document.createElement("img");
        media.src = post.mediaContent;
        media.alt = "Post Media";
        media.classList.add("post-media");
        postElement.appendChild(media);
      }
  
      postsContainer.appendChild(postElement);
    });
  }
  
  // Export the function to use in other files
  export { fetchUserDetails, displayPosts };
  
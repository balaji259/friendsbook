import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from "../api/api";
import { AuthContext } from "./AuthContext";



const backendBaseUrl = 'http://localhost:7000';




const SinglePost = () => {
  const [post, setPost] = useState(null);
  const [showMenus, setShowMenus] = useState({});
  const { postId } = useParams();

     const { token, authuser } = useContext(AuthContext);


  const fetchPost = async () => {

  if (!token) {
    console.error("User is not authenticated.");
    return;
  }

  try {
    const response = await api.get(
      `/posts/render-single/${postId}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    setPost(response.data);
  } catch (error) {
    if (error.response?.status === 401) {
      console.error("Authentication failed. Please log in again.");
    } else {
      console.error("Error fetching post:", error.response?.data || error.message);
    }
  }
};


  useEffect(() => {
    
    fetchPost();

  }, [postId]);

  const handleToggleMenu = (id) => {
    setShowMenus((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const savePost = (id) => {
    console.log(`Post ${id} saved`);
  };

  const reportPost = (id) => {
    console.log(`Post ${id} reported`);
  };

  const handleLikeToggle = (id) => {
    console.log(`Toggled like for post ${id}`);
  };

  const copyPostIdToClipboard = (id) => {
    navigator.clipboard.writeText(id);
    toast.success(`Post ID ${id} copied to clipboard`);
  };

  if (!post) return <div>Loading...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <img
          src={post.user.profilePic === '/images/default_profile.jpeg' ? '/images/default_profile.jpeg' : `${post.user.profilePic}`}
          alt={post.user.username}
          style={styles.profilePic}
        />
        <div style={styles.userInfo}>
          <span style={styles.username}>{post.user.username}</span>
          <span style={styles.createdAt}>{new Date(post.createdAt).toLocaleString()}</span>
        </div>
       
      </div>

      <div style={styles.content}>
        <p style={styles.caption}>{post.caption}</p>
        {post.postType === "image" && post.content.mediaUrl && (
          <img src={`${post.content.mediaUrl}`} alt="Post media" style={styles.media} />
        )}
        {post.postType === "video" && post.content.mediaUrl && (
        
          <video
                src={`${post.content.mediaUrl}`}
                controls
                style={styles.media}
              />
        )}
      </div>

     
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '16px',
    margin: '16px auto',
    maxWidth: '600px',
    boxSizing: 'border-box',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '12px',
    position: 'relative',
  },
  profilePic: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    marginRight: '12px',
  },
  userInfo: {
    flexGrow: 1,
    overflow: 'hidden',
  },
  username: {
    fontWeight: 'bold',
    display: 'block',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  createdAt: {
    fontSize: '0.9em',
    color: '#555',
  },
  menuButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
  },
  dropdownMenu: {
    position: 'absolute',
    top: '100%',
    right: '0',
    background: '#fff',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    zIndex: 1000,
    borderRadius: '4px',
  },
  menuItem: {
    padding: '10px',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  content: {
    marginBottom: '16px',
    wordWrap: 'break-word',
  },
  media: {
    width: '100%',
    borderRadius: '6px',
    maxHeight: '300px',
    objectFit: 'cover',
  },
  caption: {
    marginTop: '12px',
  },
  actions: {
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '10px',
  },
  actionButton: {
    flex: '1 1 auto',
    textAlign: 'center',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    padding: '10px',
    cursor: 'pointer',
  },
  commentsSection: {
    marginTop: '12px',
    borderTop: '1px solid #ddd',
    paddingTop: '12px',
  },
  comment: {
    marginBottom: '8px',
    wordWrap: 'break-word',
  },
};

export default SinglePost;

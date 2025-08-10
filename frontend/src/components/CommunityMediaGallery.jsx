// CommunityMediaGallery.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {useParams} from 'react-router-dom';

const CommunityMediaGallery = ({ groupId }) => {
  const [mediaPosts, setMediaPosts] = useState([]);

  const {id}=useParams();
  


  useEffect(() => {
    console.log(`id:${id}`);
    const fetchMediaPosts = async () => {
      try {
        const res = await axios.get(`/community/${id}/media`);
        const filtered = res.data.filter(
          post => post.postType === 'image' || post.postType === 'video'
        );
        console.log('res');
        console.log(res);
        setMediaPosts(filtered);
      } catch (error) {
        console.error('Error fetching media posts:', error);
      }
    };

    fetchMediaPosts();
  }, [groupId]);

  return (
    <div className="p-4">
     
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {mediaPosts.map((post, index) => (
          <div key={index} className="w-full aspect-[4/3] bg-gray-200 rounded-md overflow-hidden flex items-center justify-center">
            {post.postType === 'image' ? (
              <img src={post.media} alt={`Media ${index + 1}`} className="object-cover w-full h-full" />
            ) : (
              <video controls className="w-full h-full object-cover">
                <source src={post.media} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommunityMediaGallery;

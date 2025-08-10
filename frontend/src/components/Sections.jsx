import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {useNavigate} from "react-router-dom";

import Events from "./Events";
import Members from "./CommunityMembers";
import CommunityMediaGallery from './CommunityMediaGallery';
import Announcements from './Announcements';
import CommunityDiscussion from "./CommunityDiscussion";

const tabs = ["Announcements", "Discussion", "Members", "Events", "Photos", "Chat"];

const Sections = () => {
  const [activeTab, setActiveTab] = useState("Announcements");
  const [Community,setCommunity]=useState();
  const [formattedDate,setFormattedDate]=useState();



  const {id}=useParams();
  
  const navigate=useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };
  

  const renderTabContent = () => {
    switch (activeTab) {
      case "Announcements":
        return <Announcements />
      case "Discussion":
        return <CommunityDiscussion />
      case "Members":
        return <Members />;
      case "Events":
        return <Events />;
      case "Photos":
        return <CommunityMediaGallery />;
      case "Chat":
        return <div className="p-4">Coming soon ....  </div>;
      default:
        return null;
    }
  };



  const fetchCommunity=async ()=>{
    try{
      console.log("Consoling!");
      const response=await axios.get(`/community/get/${id}`)
      setCommunity(response.data);
      const isoDate = response.data.createdAt;
      const date = new Date(isoDate);

      const newdate = date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
        setFormattedDate(newdate);
      console.log(response);
      console.log(formattedDate);
    }
    catch(e){
      console.log(`Error: ${e}`);
    }
  }

  useEffect(()=>{
    fetchCommunity();
  },[])



  return (
        
    <div className="bg-[#f5f5f9] min-h-screen px-4 py-6">
    
          {/* Back Button */}
          <div className="max-w-4xl mx-auto mb-4">
          <button
            onClick={() => navigate(-1)}
            className="text-white bg-blue-600 px-4 py-2 rounded-md text-base font-medium hover:bg-blue-700 transition"
          >
            ← Back
          </button>
        </div>
            
    
    {/* Community Header */}
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-[#3b5998]">{Community?.name} </h1>
      <p className="text-sm text-gray-600">
        {Community?.members?.length} members · Created on {formattedDate}
      </p>
      
      {/* Tabs */}
      <div className="flex border-b mt-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-all duration-200 ${
              activeTab === tab
                ? 'border-[#3b2db8] text-[#3b5998]'
                : 'border-transparent text-gray-600 hover:text-[#3b5998]'
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white mt-4 rounded-lg shadow-sm">
        {renderTabContent()}
      </div>
    </div>
  </div>
);


};

export default Sections;

// Routes.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App';  // Adjust the path as needed
import Logo from './components/Logo';  // Adjust the path as needed
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import SuggestionSidebar from './components/Suggestions';
import PostComponent from './components/Posts';
import ReportPost from './components/Report';
import SinglePost from './components/SinglePost';
import Home from "./components/Home";
import UserDetails from "./components/Details";
import Profile from "./components/Profile";
import UserProfile from "./components/CheckProfile.jsx"; 
import Search from "./components/Search";
import SearchSuggestions from './components/SearchSuggestions';
import WelcomeOverlay from './components/Welcome';
import Sidebar from "./components/Sidebar.jsx";
import ChatHomePage from "./components/ChatHomePage.jsx";
import Friends from "./components/Friends.jsx";
import FriendList from "./components/FetchFriends";
import { SocketProvider } from "./components/useSocket";
import NewProfile from './components/NewProfile.jsx';
import EditProfile from "./components/EditNewProfile.jsx";
import NewPosts from "./components/NewPosts.jsx";
import OtherProfile from "./components/OtherProfile.jsx";
import OtherPosts from "./components/OtherPosts.jsx";
import FeedbackForm from './components/Feedback.jsx';
import NewFeedbackForm from './components/NewFeedback.jsx';
import About from "./components/About.jsx"
import Blog from "./components/Blog.jsx"

import FAQ from "./components/Faq.jsx"
import Coming from "./components/Comingsoon.jsx";
import Notifications from './components/Notifications.jsx'; 
import Updates from "./components/Updates.jsx"



import HolyBanner from "./components/Holy";
import Groups from "./components/Groups";
import Communities from "./components/Communities";
import Community from "./components/Community.jsx";

import Create from "./components/Create.jsx"
import CreateGroup from "./components/CreateGroup.jsx";
import CreateCommunity from "./components/CreateCommunity.jsx";

import Group from "./components/Group.jsx";
import ExploreCommunities from "./components/ExploreCommunities.jsx";

import ExploreGroups from "./components/ExploreGroups.jsx";

import CreateEvent from "./components/CreateEvent.jsx";
import Sections from "./components/Sections.jsx";

import Events from "./components/Events.jsx";
import Members from "./components/CommunityMembers.jsx";

import CommunityMediaGallery from './components/CommunityMediaGallery.jsx';
// import DiscussionPage from "./components/CommunityDiscussion.jsx";
import DiscussionPage from "./components/CommunityDiscussion.jsx";

import Announcements from "./components/Announcements.jsx";

import GroupSections from "./components/GroupSections.jsx";
import Key from "./components/Key.jsx";
import EnterKey from "./components/EnterKey.jsx";
import CommunityChat from "./components/CommunityChat.jsx";
import LoginV2 from './components/LoginV2.jsx';

const RoutesComponent = () => {
    return (
        <SocketProvider>
        <Router>
            <Routes>
                <Route path="/" element={<LoginV2 />} />
                <Route path="/welcome" element={<WelcomeOverlay />} />

                <Route path="/auth" element={<App />} />
                <Route path="/logo" element={<Logo />} />
                <Route path="/navbar" element={<Navbar />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/suggestions" element={<SuggestionSidebar/>} />
                <Route path="/posts" element={<PostComponent />} />
                <Route path="/home" element={<Home />} />
                <Route path="/report" element={<ReportPost />} />
                <Route path="/posts/:postId" element={<SinglePost />} />
                <Route path="/details" element={<UserDetails />} />
                <Route path="/profile" element={<NewProfile />} />
                <Route path="/edit" element={<EditProfile />} />
                <Route path="/profile/:userId" element={<UserProfile />} /> 
                {/* <Route path="/search" element={<Search />} /> */}
                <Route path="/search" element={<Updates />} />
                <Route path="/searchsug" element={<SearchSuggestions />} />
                <Route path="/chat/sidebar" element={<Sidebar />} />
                <Route path="/chats" element={<ChatHomePage />} />
                <Route path="/friends" element={<Friends /> } />
                {/* <Route path="/friends" element={<Updates /> } /> */}
                <Route path="/friendlist" element={<FriendList />} />
                <Route path="/newposts" element={<NewPosts /> } />

                <Route path="/other" element={<OtherProfile />} />
                <Route path="/viewposts" element={<OtherPosts />} />

                <Route path="/feedback" element={<NewFeedbackForm />} />
                <Route path="/about" element={<About />} />

                <Route path="/blog" element={<Blog />} />
               
                
                
                <Route path="/faq" element={<FAQ /> }/>
                <Route path="/contact" element={<NewFeedbackForm /> } />
                

                <Route path="/update" element={<Updates />} />
                <Route path="/notifications" element={<Notifications />} />
             
                <Route path="/holy" element={<HolyBanner />} />
                <Route path="/groups" element={<Groups />} />
                <Route path="/communities" element={<Communities />} />

                <Route path="/create" element={<Create />} /> 
                
                <Route path="/cgroup" element={<CreateGroup />} />

                <Route path="/ccom" element={<CreateCommunity />} />

                <Route path="/group/:id" element={<Group />} />
                <Route path="/community/:id" element={<Community />} />

                <Route path="/explore/communities" element={<ExploreCommunities />} />

                <Route path="/explore/groups" element={<ExploreGroups />} />

                <Route path="/create/:id/event" element={ <CreateEvent /> } />

                <Route path="/community/:id/sections" element={<Sections />} />

                <Route path="/events" element={<Events />} />

                <Route path="/community/members" element={<Members />} />

                <Route path="/community/:id/media" element={<CommunityMediaGallery />} />

                <Route path="/community/:id/discussion" element={<DiscussionPage />} />

                <Route path="/community/:id/announcements" element={<Announcements />} />

                <Route path="/group/:id/sections" element={<GroupSections />} />

                <Route path="/key/management" element={<Key />} />

                <Route path="/enter-key" element={<EnterKey />} />

                <Route path="/cchat" element={<CommunityChat />} />
            


            </Routes>
        </Router>
        </SocketProvider>
    );
};

export default RoutesComponent;

import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import "./EditNewProfile.css";
import { AuthContext } from "./AuthContext";
import { toast } from "react-hot-toast";
import { FiCamera, FiX, FiSave, FiArrowLeft } from "react-icons/fi";

const NewProfile = () => {
  const [editableData, setEditableData] = useState({});
  const [userData, setUserData] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  // BUG FIX #2: error state was missing — caused crash when fetchUserData failed
  const [error, setError] = useState(null);

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedBestFriends, setSelectedBestFriends] = useState([]);

  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  const fetchUserData = async () => {
    try {
      if (!token) {
        // BUG FIX #11: was alert() — replaced with redirect
        navigate("/login");
        return;
      }
      const response = await api.get(`/profile/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setUserData(response.data);
    } catch (error) {
      console.error("Failed to fetch user data:", error.message);
      // BUG FIX #2: setError now works because state is declared
      setError("Error fetching profile. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    if (userData) {
      setEditableData({
        username: userData.username || "",
        fullname: userData.fullname || "",
        email: userData.email || "",
        relationshipStatus: userData.relationshipStatus || "",
        bio: userData.bio || "",
        profilePic: userData.profilePic || "",
        dateOfBirth: userData.dateOfBirth ? userData.dateOfBirth.split("T")[0] : "",
        collegeName: userData.collegeName || "",
        bestFriend: userData.bestFriend || [],
        interests: userData.interests || "",
        gender: userData.gender || "",
        favoriteSport: userData.favoriteSport || "",
        favoriteGame: userData.favoriteGame || "",
        favoriteMusic: userData.favoriteMusic || "",
        favoriteMovie: userData.favoriteMovie || "",
        favoriteAnime: userData.favoriteAnime || "",
        favoriteActor: userData.favoriteActor || "",
        highschool: userData.highschool || "",
        hometown: userData.hometown || "",
        interestedIn: userData.interestedIn || "",
        lookingfor: userData.lookingfor || "",
        residence: userData.residence || "",
        school: userData.school || "",
        status: userData.status || "",
        website: userData.website || "",
        mobileNumber: userData.mobileNumber || "",
      });
      setSelectedBestFriends(userData.bestFriend || []);
    }
  }, [userData]);

  const handleSearchInputChange = async (e) => {
    const value = e.target.value;
    setQuery(value);
    if (value?.length > 0) {
      try {
        const response = await api.get(`/profile/search-bestfriend?query=${value}`);
        setSuggestions(response.data?.users || []);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (user) => {
    setSelectedBestFriends((prev) => {
      if (prev.some((u) => u._id === user._id)) return prev;
      return [...prev, user];
    });
    setQuery("");
    setSuggestions([]);
  };

  const removeFriend = (userId) => {
    setSelectedBestFriends(selectedBestFriends.filter((u) => u._id !== userId));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setEditableData((prev) => ({ ...prev, profilePic: file }));
      };
      reader.readAsDataURL(file);
    }
  };

  const saveChanges = async () => {
    setIsSaving(true);
    const formData = new FormData();

    formData.append("mobile", editableData.mobileNumber);
    formData.append("website", editableData.website);
    formData.append("fullname", editableData.fullname);
    formData.append("school", editableData.school);
    formData.append("status", editableData.status);
    formData.append("gender", editableData.gender);
    formData.append("residence", editableData.residence);
    formData.append("dateOfBirth", editableData.dateOfBirth);
    formData.append("hometown", editableData.hometown);
    formData.append("highschool", editableData.highschool);
    formData.append("lookingfor", editableData.lookingfor);
    formData.append("interestedIn", editableData.interestedIn);
    // BUG FIX #6: backend uses "relationshipstatus" as form field name
    formData.append("relationshipstatus", editableData.relationshipStatus);
    formData.append("bestfriend", JSON.stringify(selectedBestFriends.map((u) => u._id)));
    formData.append("collegename", editableData.collegeName);
    formData.append("interests", editableData.interests);
    formData.append("sport", editableData.favoriteSport);
    formData.append("game", editableData.favoriteGame);
    formData.append("music", editableData.favoriteMusic);
    formData.append("movie", editableData.favoriteMovie);
    formData.append("anime", editableData.favoriteAnime);
    formData.append("actor", editableData.favoriteActor);
    formData.append("bio", editableData.bio);

    if (editableData.profilePic instanceof File) {
      formData.append("profilePic", editableData.profilePic);
    }

    try {
      // NOTE: Do NOT set Content-Type manually here.
      // When FormData is passed, Axios auto-sets "multipart/form-data; boundary=..."
      // Manually overriding it strips the boundary, which breaks formidable's file parsing.
      await api.patch(`/profile/update`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Profile updated successfully! 🎉");
      navigate("/profile");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to save profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="ep-loading-screen">
        <div className="ep-spinner" />
        <p>Loading your profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ep-error-screen">
        <div className="ep-error-card">
          <div className="ep-error-icon">⚠️</div>
          <h2>Could not load profile</h2>
          <p>{error}</p>
          <button onClick={fetchUserData} className="ep-btn-primary">Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="ep-page">
      {/* Header */}
      <div className="ep-top-bar">
        <button className="ep-back-btn" onClick={() => navigate("/profile")}>
          <FiArrowLeft size={16} /> Back to Profile
        </button>
        {/* BUG FIX #14: was static "Name of the User:username" text */}
        <h1 className="ep-page-title">Edit Profile — @{userData?.username}</h1>
        <div className="ep-header-actions">
          <button className="ep-btn-secondary" onClick={() => navigate("/profile")}>
            Cancel
          </button>
          <button
            className={`ep-btn-primary ${isSaving ? "ep-btn-loading" : ""}`}
            onClick={saveChanges}
            disabled={isSaving}
          >
            {isSaving ? (
              <><div className="ep-btn-spinner" /> Saving...</>
            ) : (
              <><FiSave size={14} /> Save Changes</>
            )}
          </button>
        </div>
      </div>

      <div className="ep-content">
        {/* Profile Picture Upload */}
        <div className="ep-card ep-photo-card">
          <h3 className="ep-card-title">Profile Photo</h3>
          <div className="ep-photo-area">
            <div className="ep-photo-preview">
              {previewImage ? (
                <img src={previewImage} alt="Preview" className="ep-preview-img" />
              ) : editableData.profilePic && typeof editableData.profilePic === "string" ? (
                <img src={editableData.profilePic} alt="Current" className="ep-preview-img" />
              ) : (
                <div className="ep-photo-placeholder">
                  <FiCamera size={32} color="#aaa" />
                  <span>No photo</span>
                </div>
              )}
            </div>
            <div className="ep-photo-actions">
              <label className="ep-btn-primary" htmlFor="photoInput" style={{ cursor: "pointer" }}>
                <FiCamera size={14} /> Upload New Photo
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: "none" }}
                id="photoInput"
              />
              <p className="ep-photo-hint">JPG, PNG or WebP · Max 5MB</p>
            </div>
          </div>
        </div>

        <div className="ep-grid">
          {/* Left Column */}
          <div className="ep-col">
            {/* Contact Info */}
            <div className="ep-card">
              <h3 className="ep-card-title">📬 Contact Info</h3>
              <div className="ep-field-group">
                <label className="ep-label">Mobile Number</label>
                <input type="tel" name="mobileNumber" value={editableData.mobileNumber || ""} onChange={handleInputChange} className="ep-input" placeholder="e.g. +91 98765 43210" />
              </div>
              <div className="ep-field-group">
                <label className="ep-label">Website</label>
                <input type="url" name="website" value={editableData.website || ""} onChange={handleInputChange} className="ep-input" placeholder="https://yourwebsite.com" />
              </div>
            </div>

            {/* Account Info */}
            <div className="ep-card">
              <h3 className="ep-card-title">👤 Account Info</h3>
              <div className="ep-field-group">
                <label className="ep-label">Full Name</label>
                <input type="text" name="fullname" value={editableData.fullname || ""} onChange={handleInputChange} className="ep-input" />
              </div>
              <div className="ep-field-group">
                <label className="ep-label">Bio</label>
                <textarea rows={3} name="bio" value={editableData.bio || ""} onChange={handleInputChange} className="ep-textarea" placeholder="Write something about yourself..." />
              </div>
            </div>

            {/* Basic Info */}
            <div className="ep-card">
              <h3 className="ep-card-title">📋 Basic Info</h3>
              <div className="ep-field-group">
                <label className="ep-label">School</label>
                <input type="text" name="school" value={editableData.school || ""} onChange={handleInputChange} className="ep-input" />
              </div>
              <div className="ep-field-group">
                <label className="ep-label">High School</label>
                <input type="text" name="highschool" value={editableData.highschool || ""} onChange={handleInputChange} className="ep-input" />
              </div>
              <div className="ep-field-group">
                <label className="ep-label">College / University</label>
                <input type="text" name="collegeName" value={editableData.collegeName || ""} onChange={handleInputChange} className="ep-input" />
              </div>
              <div className="ep-field-group">
                <label className="ep-label">Status</label>
                <select name="status" value={editableData.status || ""} onChange={handleInputChange} className="ep-select">
                  <option value="">Select Status</option>
                  <option value="student">Student</option>
                  <option value="professor">Professor</option>
                  <option value="working">Working</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="ep-field-group">
                <label className="ep-label">Gender</label>
                <select name="gender" value={editableData.gender || ""} onChange={handleInputChange} className="ep-select">
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
              </div>
              <div className="ep-field-group">
                <label className="ep-label">Birthday</label>
                <input type="date" name="dateOfBirth" value={editableData.dateOfBirth || ""} onChange={handleInputChange} className="ep-input" />
              </div>
              <div className="ep-field-group">
                <label className="ep-label">Hometown</label>
                <input type="text" name="hometown" value={editableData.hometown || ""} onChange={handleInputChange} className="ep-input" />
              </div>
              <div className="ep-field-group">
                <label className="ep-label">Current Residence</label>
                <input type="text" name="residence" value={editableData.residence || ""} onChange={handleInputChange} className="ep-input" />
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="ep-col">
            {/* Personal Info */}
            <div className="ep-card">
              <h3 className="ep-card-title">💬 Personal Info</h3>
              <div className="ep-field-group">
                <label className="ep-label">Looking For</label>
                <input type="text" name="lookingfor" value={editableData.lookingfor || ""} onChange={handleInputChange} className="ep-input" placeholder="Friendship, networking..." />
              </div>
              <div className="ep-field-group">
                <label className="ep-label">Interested In</label>
                <input type="text" name="interestedIn" value={editableData.interestedIn || ""} onChange={handleInputChange} className="ep-input" />
              </div>
              <div className="ep-field-group">
                <label className="ep-label">Relationship Status</label>
                {/* BUG FIX #6: name was "relationshipstatus" but state key was "relationshipStatus"
                    Fixed: state key is now "relationshipStatus" and we append the lowercase
                    version to FormData in saveChanges() */}
                <select name="relationshipStatus" value={editableData.relationshipStatus || ""} onChange={handleInputChange} className="ep-select">
                  <option value="">Select Status</option>
                  <option value="single">Single</option>
                  <option value="in-a-relationship">In a Relationship</option>
                  <option value="married">Married</option>
                  <option value="complicated">It's Complicated</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Best Friend Search */}
              <div className="ep-field-group ep-bestfriend-group">
                <label className="ep-label">Best Friends</label>
                <div className="ep-search-wrapper">
                  <input
                    type="text"
                    value={query}
                    onChange={handleSearchInputChange}
                    placeholder="Search by username..."
                    className="ep-input"
                    autoComplete="off"
                  />
                  {suggestions?.length > 0 && (
                    <ul className="ep-dropdown">
                      {suggestions.map((user) => (
                        <li key={user._id} onClick={() => handleSuggestionClick(user)} className="ep-dropdown-item">
                          {user.username}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                {selectedBestFriends?.length > 0 && (
                  <div className="ep-tags">
                    {selectedBestFriends.map((friend) => (
                      <span key={friend._id} className="ep-tag">
                        {friend.username}
                        <button onClick={() => removeFriend(friend._id)} className="ep-tag-remove">
                          <FiX size={10} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Interests & Favorites */}
            <div className="ep-card">
              <h3 className="ep-card-title">🎯 Interests & Favorites</h3>
              <div className="ep-field-group">
                <label className="ep-label">General Interests</label>
                <input type="text" name="interests" value={editableData.interests || ""} onChange={handleInputChange} className="ep-input" placeholder="Reading, travel, coding..." />
              </div>
              <div className="ep-interests-grid">
                <div className="ep-field-group">
                  <label className="ep-label">⚽ Favorite Sport</label>
                  <input type="text" name="favoriteSport" value={editableData.favoriteSport || ""} onChange={handleInputChange} className="ep-input" />
                </div>
                <div className="ep-field-group">
                  <label className="ep-label">🎮 Favorite Game</label>
                  <input type="text" name="favoriteGame" value={editableData.favoriteGame || ""} onChange={handleInputChange} className="ep-input" />
                </div>
                <div className="ep-field-group">
                  <label className="ep-label">🎵 Favorite Music</label>
                  <input type="text" name="favoriteMusic" value={editableData.favoriteMusic || ""} onChange={handleInputChange} className="ep-input" />
                </div>
                <div className="ep-field-group">
                  <label className="ep-label">🎬 Favorite Movie</label>
                  <input type="text" name="favoriteMovie" value={editableData.favoriteMovie || ""} onChange={handleInputChange} className="ep-input" />
                </div>
                <div className="ep-field-group">
                  <label className="ep-label">📺 Favorite Anime</label>
                  <input type="text" name="favoriteAnime" value={editableData.favoriteAnime || ""} onChange={handleInputChange} className="ep-input" />
                </div>
                <div className="ep-field-group">
                  <label className="ep-label">🌟 Favorite Actor</label>
                  <input type="text" name="favoriteActor" value={editableData.favoriteActor || ""} onChange={handleInputChange} className="ep-input" />
                </div>
              </div>
            </div>

            {/* Bottom save bar on mobile */}
            <div className="ep-mobile-save">
              <button className="ep-btn-secondary" onClick={() => navigate("/profile")}>Cancel</button>
              <button className={`ep-btn-primary ${isSaving ? "ep-btn-loading" : ""}`} onClick={saveChanges} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewProfile;
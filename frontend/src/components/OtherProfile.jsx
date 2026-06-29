import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./NewProfile.css"; // Shared profile styles
import { useSocket } from "./useSocket";
import { FiLogOut, FiMail, FiPhone, FiGlobe, FiMapPin, FiCalendar, FiHeart, FiBook, FiHome, FiMessageSquare } from "react-icons/fi";
// BUG FIX #5: import the project's api instance instead of raw axios
import api from "../api/api";
import { useChatStore } from "./useChatStore";
import AppLayout from "./AppLayout";

const InfoRow = ({ icon, label, value }) => {
  if (!value) return null;
  return (
    <div className="np-info-row">
      <span className="np-info-icon">{icon}</span>
      <div className="np-info-text">
        <span className="np-info-label">{label}</span>
        <span className="np-info-value">{value}</span>
      </div>
    </div>
  );
};

const InterestTag = ({ emoji, label, value }) => {
  if (!value) return null;
  return (
    <div className="np-interest-tag">
      <span className="np-interest-emoji">{emoji}</span>
      <div>
        <div className="np-interest-label">{label}</div>
        <div className="np-interest-value">{value}</div>
      </div>
    </div>
  );
};

// ── Constellation Banner ──────────────────────────────────────────────────────
const ConstellationBanner = ({ seed = "user" }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    // Seed a stable random using the username string
    let seedVal = 0;
    for (let i = 0; i < seed.length; i++) seedVal += seed.charCodeAt(i);
    const rng = (() => { let s = seedVal; return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; }; })();

    const W = canvas.width;
    const H = canvas.height;

    // Color palettes keyed by seed mod
    const palettes = [
      { bg: "#0d0d1a", primary: "#6c5ce7", secondary: "#a29bfe", accent: "#fd79a8" },
      { bg: "#0a1628", primary: "#0984e3", secondary: "#74b9ff", accent: "#00cec9" },
      { bg: "#0d1a0d", primary: "#00b894", secondary: "#55efc4", accent: "#fdcb6e" },
      { bg: "#1a0d1a", primary: "#e84393", secondary: "#fd79a8", accent: "#a29bfe" },
    ];
    const pal = palettes[seedVal % palettes.length];

    const numParticles = 55;
    const particles = Array.from({ length: numParticles }, () => ({
      x: rng() * W,
      y: rng() * H,
      vx: (rng() - 0.5) * 0.4,
      vy: (rng() - 0.5) * 0.4,
      r: rng() * 2 + 1,
      opacity: rng() * 0.6 + 0.3,
    }));

    let animId;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      // Background
      ctx.fillStyle = pal.bg;
      ctx.fillRect(0, 0, W, H);

      // Subtle overlay gradient
      const grad = ctx.createLinearGradient(0, 0, W, H);
      grad.addColorStop(0, pal.primary + "33");
      grad.addColorStop(1, pal.secondary + "22");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      // Move particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H;
        if (p.y > H) p.y = 0;
      });

      // Draw lines between close particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110) {
            const alpha = (1 - dist / 110) * 0.35;
            ctx.beginPath();
            ctx.strokeStyle = pal.secondary + Math.round(alpha * 255).toString(16).padStart(2, "0");
            ctx.lineWidth = 0.8;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw particles
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = pal.secondary;
        ctx.globalAlpha = p.opacity;
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      // Accent glow orbs (fixed, seeded)
      const orbs = [
        { x: W * 0.15, y: H * 0.5, color: pal.primary },
        { x: W * 0.75, y: H * 0.4, color: pal.accent },
        { x: W * 0.5, y: H * 0.3, color: pal.secondary },
      ];
      orbs.forEach(({ x, y, color }) => {
        const glow = ctx.createRadialGradient(x, y, 0, x, y, 80);
        glow.addColorStop(0, color + "44");
        glow.addColorStop(1, "transparent");
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, W, H);
      });

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animId);
  }, [seed]);

  return (
    <canvas
      ref={canvasRef}
      width={1100}
      height={200}
      className="np-cover-canvas"
    />
  );
};

const OtherProfile = () => {
  const [userData, setUserData] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [friends, setFriends] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [mutualFriendsCount, setMutualFriendsCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  // New state for inline posts grid
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showTextPosts, setShowTextPosts] = useState(false);

  const { onlineUsers } = useSocket();
  const { profileId, setProfileId, setChatUserId } = useChatStore();
  const navigate = useNavigate();

  // Parse JWT to get current user id
  const parseJwt = (token) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      return JSON.parse(window.atob(base64));
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }
    const payload = parseJwt(token);
    if (!payload?.userId) {
      navigate("/");
      return;
    }
    setCurrentUserId(payload.userId);
  }, []);

  // Fetch target user profile
  useEffect(() => {
    if (!profileId) return;
    // BUG FIX #5: use api instance instead of raw axios
    api.get(`/user/viewProfile/${profileId}`)
      .then((res) => setUserData(res.data))
      .catch((err) => console.error("Error fetching user data:", err))
      .finally(() => setPageLoading(false));
  }, [profileId]);

  // Fetch follow status, connection, mutual friends, friends list, posts
  useEffect(() => {
    if (!profileId || !currentUserId) return;
    checkConnection();
    fetchMutualFriends();
    getFriendsDetails();
    fetchFollowStatus();
    fetchUserPosts();
  }, [currentUserId, profileId]);

  const checkConnection = async () => {
    try {
      // BUG FIX #5: use api instance
      const res = await api.get(`/profile/check-connection/${currentUserId}/${profileId}`);
      setConnectionStatus(res.data);
    } catch (err) {
      console.error("Error checking connection:", err);
    }
  };

  const fetchMutualFriends = async () => {
    try {
      const res = await api.get(`/profile/mutual-friends/${currentUserId}/${profileId}`);
      setMutualFriendsCount(res.data.mutualFriendsCount);
    } catch (err) {
      console.error("Error fetching mutual friends:", err);
    }
  };

  const getFriendsDetails = async () => {
    try {
      // BUG FIX #4: was hardcoded fetch('http://localhost:7000/...') — now uses api
      const res = await api.get(`/profile/getfriends/${profileId}`);
      setFriends(res.data);
    } catch (err) {
      console.error("Error fetching friends:", err);
    }
  };

  const fetchFollowStatus = async () => {
    try {
      const res = await api.get(`/profile/isFollowing/${profileId}/${currentUserId}`);
      setIsFollowing(res.data.isFollowing);
    } catch (err) {
      console.error("Error fetching follow status:", err);
    }
  };

  const fetchUserPosts = async () => {
    try {
      const res = await api.get(`/profile/userPosts/${profileId}`);
      setPosts(res.data.posts || []);
    } catch (error) {
      console.error("Error fetching user posts:", error);
    }
  };

  const handleFollowToggle = async () => {
    if (!currentUserId || !profileId) return;
    setLoading(true);
    try {
      if (isFollowing) {
        await api.post(`/profile/unfollow/${profileId}/${currentUserId}`);
        setIsFollowing(false);
        setUserData((prev) => ({ ...prev, followers: prev.followers.filter((id) => id !== currentUserId) }));
      } else {
        await api.post(`/profile/follow/${profileId}/${currentUserId}`);
        setIsFollowing(true);
        setUserData((prev) => ({ ...prev, followers: [...prev.followers, currentUserId] }));
        
        // Send follow notification (if not self)
        if (profileId !== currentUserId) {
          try {
            await api.post("/notifications/create", {
              userId: profileId,
              senderId: currentUserId,
              type: "Follow Notification",
              title: "Follow Notification",
              body: "started following you"
            });
          } catch (err) {
            console.error("Error sending follow notification:", err);
          }
        }
      }
    } catch (err) {
      console.error("Error updating follow status:", err);
    } finally {
      setLoading(false);
    }
  };

  const startChat = () => {
    setChatUserId(profileId);
    navigate("/chats");
  };

  const goToHome = () => {
    setProfileId(null);
    navigate("/home");
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  };

  const isOnline = onlineUsers && Array.isArray(onlineUsers) && profileId && onlineUsers.includes(profileId);

  if (pageLoading || !userData) {
    return (
      <div className="np-loading-screen">
        <div className="np-skeleton-wrapper">
          <div className="np-skeleton-banner" />
          <div className="np-skeleton-avatar" />
          <div className="np-skeleton-line wide" />
          <div className="np-skeleton-line medium" />
          <div className="np-skeleton-stats">
            <div className="np-skeleton-stat" />
            <div className="np-skeleton-stat" />
            <div className="np-skeleton-stat" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <AppLayout>
      <div className="np-page">
        <div className="np-profile-wrapper">
        {/* ── Cover + Avatar Header ── */}
        <div className="np-cover-section">
          <ConstellationBanner seed={userData.username || "friendsbook"} />
          <div className="np-avatar-area">
            <div className="np-avatar-container">
              <img
                src={userData.profilePic || "/images/squarepfp.png"}
                alt={userData.username}
                className="np-avatar-img"
                onError={(e) => { e.target.src = "/images/squarepfp.png"; }}
              />
              {isOnline && <span className="np-online-dot" title="Online now" />}
            </div>

            <div className="np-profile-identity">
              <h1 className="np-username">
                @{userData.username}
                {isOnline && (
                  <span style={{ fontSize: "12px", color: "#22c55e", fontWeight: 600, marginLeft: "8px" }}>
                    ● Online
                  </span>
                )}
              </h1>
              <p className="np-fullname">{userData.fullname}</p>
              {userData.bio && <p className="np-bio">"{userData.bio}"</p>}
              {userData.collegeName && <p className="np-college">🎓 {userData.collegeName}</p>}
            </div>

            <div className="np-header-actions">
              {/* Connection & Mutual badges */}
              <div className="np-connection-badges">
                {connectionStatus?.connection && (
                  <span className="np-badge-connected">🤝 Connected</span>
                )}
                {mutualFriendsCount > 0 && (
                  <span className="np-badge-mutual">👥 {mutualFriendsCount} Mutual</span>
                )}
              </div>
              <div className="np-other-actions">
                <button
                  onClick={handleFollowToggle}
                  disabled={loading}
                  className={`${isFollowing ? "np-btn-unfollow" : "np-btn-follow"} ${loading ? "np-btn-disabled" : ""}`}
                >
                  {loading ? "..." : isFollowing ? "Unfollow" : "Follow"}
                </button>
                <button className="np-btn-chat" onClick={startChat}>
                  <FiMessageSquare size={14} style={{ marginRight: 4 }} /> Chat
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Stats Bar ── */}
        <div className="np-stats-bar">
          <div className="np-stat-item">
            <span className="np-stat-number">{userData.postsCount || 0}</span>
            <span className="np-stat-label">Posts</span>
          </div>
          <div className="np-stat-divider" />
          <div className="np-stat-item">
            <span className="np-stat-number">{userData.followers?.length || 0}</span>
            <span className="np-stat-label">Followers</span>
          </div>
          <div className="np-stat-divider" />
          <div className="np-stat-item">
            <span className="np-stat-number">{userData.following?.length || 0}</span>
            <span className="np-stat-label">Following</span>
          </div>
          <div className="np-stat-divider" />
          <div className="np-stat-item">
            <span className="np-stat-number">{mutualFriendsCount}</span>
            <span className="np-stat-label">Mutual</span>
          </div>
        </div>

        {/* ── Main Content Grid ── */}
        <div className="np-content-grid">
          {/* Left Column */}
          <div className="np-left-col">
            <div className="np-card">
              <h3 className="np-card-title">Contact Info</h3>
              <InfoRow icon={<FiMail />} label="Email" value={userData.email} />
              <InfoRow icon={<FiPhone />} label="Mobile" value={userData.mobileNumber} />
              <InfoRow icon={<FiGlobe />} label="Website" value={userData.website} />
            </div>

            <div className="np-card">
              <h3 className="np-card-title">Basic Info</h3>
              <InfoRow icon={<FiBook />} label="School" value={userData.school} />
              <InfoRow icon={<FiHome />} label="Hometown" value={userData.hometown} />
              <InfoRow icon={<FiMapPin />} label="Residence" value={userData.residence} />
              <InfoRow icon={<FiCalendar />} label="Birthday" value={formatDate(userData.dateOfBirth)} />
              <InfoRow icon="🎓" label="High School" value={userData.highschool} />
              <InfoRow icon="💼" label="Status" value={userData.status} />
              <InfoRow icon="⚧" label="Gender" value={userData.gender} />
            </div>

            <div className="np-card">
              <h3 className="np-card-title">Personal Info</h3>
              <InfoRow icon={<FiHeart />} label="Relationship" value={userData.relationshipStatus} />
              <InfoRow icon="👀" label="Looking For" value={userData.lookingfor} />
              <InfoRow icon="✨" label="Interested In" value={userData.interestedIn} />
              {userData.bestFriend && userData.bestFriend.length > 0 && (
                <div className="np-info-row">
                  <span className="np-info-icon">⭐</span>
                  <div className="np-info-text">
                    <span className="np-info-label">Best Friends</span>
                    <span className="np-info-value">
                      {userData.bestFriend.map(f => f?.username || f).join(", ")}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="np-right-col">
            {friends.length > 0 && (
              <div className="np-card">
                <h3 className="np-card-title">Friends</h3>
                <div className="np-friends-grid">
                  {friends.map((friend) => (
                    <div key={friend._id} className="np-friend-card">
                      <img
                        src={friend.profilePic || "/images/squarepfp.png"}
                        alt={friend.username}
                        className="np-friend-pic"
                        onError={(e) => { e.target.src = "/images/squarepfp.png"; }}
                      />
                      <p className="np-friend-name">{friend.username}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="np-card">
              <h3 className="np-card-title">Interests & Favorites</h3>
              <div className="np-interests-grid">
                <InterestTag emoji="🎮" label="Game" value={userData.favoriteGame} />
                <InterestTag emoji="🎵" label="Music" value={userData.favoriteMusic} />
                <InterestTag emoji="🎬" label="Movie" value={userData.favoriteMovie} />
                <InterestTag emoji="⚽" label="Sport" value={userData.favoriteSport} />
                <InterestTag emoji="📺" label="Anime" value={userData.favoriteAnime} />
                <InterestTag emoji="🌟" label="Actor" value={userData.favoriteActor} />
              </div>
              {userData.interests && (
                <div className="np-interests-text">
                  <span className="np-info-label">Interests</span>
                  <p className="np-interests-desc">{userData.interests}</p>
                </div>
              )}
            </div>

            <div className="np-card np-account-card">
              <h3 className="np-card-title">Account Info</h3>
              <div className="np-account-row">
                <span className="np-account-label">Member Since</span>
                <span className="np-account-value">{userData.createdAt?.split("T")[0]}</span>
              </div>
              <div className="np-account-row">
                <span className="np-account-label">Last Updated</span>
                <span className="np-account-value">{userData.updatedAt?.split("T")[0]}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Posts Section ── */}
        <div className="np-tabs-container">
          <div className="np-tabs-row">
            <div className="np-tabs">
              <button className="np-tab active">
                Posts
              </button>
            </div>
            <button
              className={`np-text-toggle ${showTextPosts ? 'active' : ''}`}
              onClick={() => setShowTextPosts(prev => !prev)}
              title={showTextPosts ? "Hide text posts" : "Show text posts"}
            >
              {showTextPosts ? "Hide text posts" : "Show text posts"}
            </button>
          </div>

          <div className="np-post-grid">
            {(() => {
              const filteredPosts = !showTextPosts
                ? posts.filter(p => p.postType !== "text")
                : posts;
              return (
                <>
                  {filteredPosts.map((post, idx) => (
                    <div
                      key={post._id}
                      className="np-post-cell"
                      onClick={() => setSelectedPost(post)}
                    >
                      {post.postType === "image" && post.content?.mediaUrl && (
                        <img src={post.content.mediaUrl} alt="Post" className="np-post-media" />
                      )}
                      {post.postType === "video" && post.content?.mediaUrl && (
                        <>
                          <video className="np-post-media" muted>
                            <source src={post.content.mediaUrl} type="video/mp4" />
                          </video>
                          <div className="np-post-video-badge">▶</div>
                        </>
                      )}
                      {post.postType === "text" && (
                        <div className={`np-post-text-preview np-text-palette-${idx % 5}`}>
                          <p className="np-text-body">{post.caption?.length > 90 ? post.caption.slice(0, 90) + "…" : post.caption}</p>
                        </div>
                      )}
                    </div>
                  ))}
                  {filteredPosts.length === 0 && (
                    <div className="np-no-posts">
                      <div className="np-no-posts-icon">📭</div>
                      <p>{!showTextPosts ? "No media posts yet." : "No posts to show here yet."}</p>
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        </div>
      </div>

      {/* ── Post Viewer Modal ── */}
      {selectedPost && (
        <div className="np-modal-backdrop" onClick={() => setSelectedPost(null)}>
          <div className="np-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="np-modal-close" onClick={() => setSelectedPost(null)}>✖</button>
            
            <div className="np-modal-header">
              <img
                src={selectedPost.user?.profilePic || userData.profilePic || "/images/squarepfp.png"}
                alt="Profile"
                className="np-modal-avatar"
                onError={(e) => { e.target.src = "/images/squarepfp.png"; }}
              />
              <strong className="np-modal-username">
                {selectedPost.user?.username || userData.username}
              </strong>
            </div>

            {selectedPost.caption && (
              <p className="np-modal-caption">{selectedPost.caption}</p>
            )}

            <div className="np-modal-media-container">
              {selectedPost.postType === "image" && selectedPost.content?.mediaUrl && (
                <img src={selectedPost.content.mediaUrl} alt="Post content" className="np-modal-img" />
              )}
              {selectedPost.postType === "video" && selectedPost.content?.mediaUrl && (
                <video controls className="np-modal-video">
                  <source src={selectedPost.content.mediaUrl} type="video/mp4" />
                </video>
              )}
            </div>
          </div>
        </div>
      )}
      </div>
    </AppLayout>
  );
};

export default OtherProfile;
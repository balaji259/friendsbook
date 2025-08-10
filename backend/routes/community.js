const express = require("express");
const multer = require("multer");
const Community = require("../models/community"); // Import the Group model
const Discussion=require('../models/discussion');
const Announcement=require('../models/announcements');

const router = express.Router();

const CommunityPosts=require("../models/communityposts");

const formidable = require("formidable");

const cloudinary = require('../cloudinaryConfig');

const fs = require("fs");
const path = require("path");
const multiparty = require("multiparty");




router.get("/:id/getdiscussions",async (req,res)=>{
  
  console.log("inside discussios rpuite!");
  const { id } = req.params; // this is the community ID

  try {
    const messages = await Discussion.find({ communityId: id }).sort({ createdAt: 1 });
    console.log(messages);
    res.json(messages);
  } catch (err) {
    console.error("Error fetching community discussions:", err);
    res.status(500).json({ error: "Failed to fetch messages" });
  }

})




router.post("/create", async (req, res) => {
  try {
    const form = new formidable.IncomingForm({ multiples: true });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error("Form parsing error:", err);
        return res.status(400).json({ error: "Failed to parse form data" });
      }

      const parsedFields = Object.fromEntries(
        Object.entries(fields).map(([key, value]) => [key, value[0]])
      );

      console.log("Received form fields:", parsedFields);
      console.log("Received form files:", files);

      console.log("Profile Picture Path:", files.profilePicture?.[0]?.filepath);
      console.log("Cover Photo Path:", files.coverPhoto?.[0]?.filepath);


      const {
        name,
        category,
        description,
        visibility,
        joinMethod,
        allowPosts,
        allowComments,
        requireApproval,
        createdBy,
      } = parsedFields;

      if (!name || !category || !createdBy) {
        return res.status(400).json({ message: "Name, category, and createdBy are required!" });
      }

      const validCategories = ["Academic Club", "Sports Team", "Student Organization"];
      if (!validCategories.includes(category)) {
        return res.status(400).json({ message: "Invalid category!" });
      }

      const validVisibility = ["public", "college", "members"];
      if (visibility && !validVisibility.includes(visibility)) {
        return res.status(400).json({ message: "Invalid visibility value!" });
      }

      const validJoinMethods = ["anyone", "approval", "invitation"];
      if (joinMethod && !validJoinMethods.includes(joinMethod)) {
        return res.status(400).json({ message: "Invalid joinMethod value!" });
      }

      try {
        let profilePictureUrl = null;
        let coverPhotoUrl = null;

        if (files.profilePicture && files.profilePicture.length > 0) {
          const uploadResult = await cloudinary.uploader.upload(files.profilePicture[0].filepath, {
            folder: "group_profile_pics",
            allowed_formats: ["jpg", "jpeg", "png", "webp"],
          });
          profilePictureUrl = uploadResult.secure_url;
        }

        if (files.coverPhoto && files.coverPhoto.length > 0) {
          const uploadResult = await cloudinary.uploader.upload(files.coverPhoto[0].filepath, {
            folder: "group_cover_photos",
            allowed_formats: ["jpg", "jpeg", "png", "webp"],
          });
          coverPhotoUrl = uploadResult.secure_url;
        }



        console.log("coverPhotoUrl");
        console.log(coverPhotoUrl);
        console.log("profilePhotoUrl");
        console.log(profilePictureUrl);

        
        const newCommunity = new Community({
          name,
          category,
          description,
          profilePicture: profilePictureUrl,
          coverPhoto: coverPhotoUrl,
          createdBy,
          members: [createdBy], // Add creator to members
          admins: [createdBy],  // Add creator to admins
    
          visibility: visibility || "public",
          joinMethod: joinMethod || "anyone",
          permissions: {
            allowPosts: allowPosts === "true",
            allowComments: allowComments === "true",
            requireApproval: requireApproval === "true",
          },
        });

        console.log("new community before saving");
        console.log(newCommunity);

 

        await newCommunity.save();

        res.status(201).json({ message: "Community created successfully!", community: newCommunity });
      } catch (error) {
        console.error("Error creating community:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
      }
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).json({ message: "Unexpected Error", error: error.message });
  }
});


router.get("/get/all", async (req, res) => {
  try {
    const communities = await Community.find().populate("members posts");
    res.json(communities);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});


router.get("/get/communities/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const communities = await Community.find({ members: userId }).populate("members posts");
    res.json(communities);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});




router.get("/get/:groupId", async (req, res) => {
  try {
    const com = await Community.findById(req.params.groupId)
      .populate("admins", "name")
      .populate({
        path: "posts",
        populate: { path: "user", select: "name" }
      });

    if (!com) return res.status(404).json({ error: "Community not found" });

    res.json(com);
  } catch (error) {
    console.error("Error fetching community:", error);  // Add this
    res.status(500).json({ error: "Server error" });
  }
});


// Join Community
router.post("/:comId/join", async (req, res) => {
  try {
    const { userId } = req.body;
    const { comId } = req.params;

    console.log(userId);
    console.log(comId);

    const community = await Community.findById(comId);
    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }

    // Check if user is already a member
    if (community.members.includes(userId)) {
      return res.status(400).json({ message: "User is already a member" });
    }

    // Add user to group
    community.members.push(userId);
    await community.save();

    res.status(200).json({ message: "Joined the community successfully", community });
  } catch (error) {
    console.error("Error joining community:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Route to get the last 3 members who joined a community
router.get("/:id/recent-members", async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find the community and get the last 3 members
    const community = await Community.findById(id).populate({
      path: "members",
      options: { sort: { _id: -1 }, limit: 3 }, // Assuming _id follows insertion order
    });

    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }

    res.json({ recentMembers: community.members });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});


router.get("/:id/admins", async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find the community and get the last 3 members
    const community = await Community.findById(id).populate({
      path: "admins",
      options: { sort: { _id: -1 }, limit: 3 }, // Assuming _id follows insertion order
    });

    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }

    res.json({ admins: community.admins });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /community/:id - Fetch community details by ID
router.get("get-details/:id", async (req, res) => {
  const { id } = req.params;

  try {
    console.log("in try!");
    const community = await Community.findById(id)
      .populate("createdBy", "name email") // populate basic creator info
      .populate("members", "_id name")     // you can customize the fields
      .populate("admins", "_id name")
      .populate("posts");                  // optional: customize if needed

    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }

    console.log(community);
    res.status(200).json(community);
  } catch (err) {
    console.error("Error fetching community:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


router.post("/:id/leave", async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    const community = await Community.findById(id);
    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }

    // Check if the user is a member
    if (!community.members.includes(userId)) {
      return res.status(400).json({ message: "You are not a member of this community" });
    }

    // Remove user from members list
    community.members = community.members.filter((member) => member.toString() !== userId);

    await community.save();

    res.json({ message: "Successfully left the community" });
  } catch (error) {
    console.error("Error leaving community:", error);
    res.status(500).json({ message: "Server error" });
  }
});


router.post("/post", async (req, res) => {
  try {

      console.log("inside the post route!");

      const form = new multiparty.Form();

      form.parse(req, async (err, fields) => {
          if (err) {
              console.error("Form parse error:", err);
              return res.status(500).json({ error: "Failed to parse form data" });
          }

          const userId = fields.userId?.[0];
          const groupId = fields.groupId?.[0];
          const caption = fields.caption?.[0]?.trim() || null;
          const mediaUrl = fields.mediaContent?.[0] || null;

          if (!userId || !groupId) {
              return res.status(400).json({ error: "User ID and Group ID are required" });
          }

          let postType = "text";
          if (mediaUrl) {
              const ext = mediaUrl.split('.').pop().toLowerCase();
              postType = ["mp4", "mov", "avi"].includes(ext) ? "video" : "image";
          }

          const post = new CommunityPosts({
              user: userId,
              group_id: groupId,
              postType,
              caption,
              media: mediaUrl,
          });


     

          // console.log(post);

          await post.save();

                // 🔥 Increment postCount and add post reference in group
      await Community.findByIdAndUpdate(groupId, {
        $inc: { postCount: 1 },
        $push: { posts: post._id },
      });


          res.status(201).json({ message: "Post created successfully", post });
      });
  } catch (error) {
      console.error("Error creating post:", error);
      res.status(500).json({ error: "Failed to create post" });
  }
});

//get all posts of the community

router.get('/posts/:groupId', async (req, res) => {
  try {

    const {groupId} = req.params;

    const posts = await CommunityPosts.find( {group_id: groupId} )
      .populate('user', 'name email profilePic username')           // Populate user details
      .populate('group_id', 'name')             // Populate group details
      .populate('comments')                     // Optional: populate comments if needed
      .sort({ createdAt: -1 });                 // Sort newest first



    console.log(posts);

    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});


router.get("/:id/members", async (req, res) => {
  try {
    const community = await Community.findById(req.params.id).populate({
      path: "members",
      select: "fullname email profilePic", // 👈 use fields from your User schema
    });

    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }

    console.log("Fetched members:", community.members);

    res.json(community.members);
  } catch (err) {
    console.error("Error fetching members:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get('/:id/media', async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch media posts from CommunityPosts
    const communityMedia = await CommunityPosts.find({
      group_id: id,
      postType: { $in: ['image', 'video'] },
    })
      .select('postType media caption createdAt')
      .sort({ createdAt: -1 });

    // Fetch media posts from Announcements
    const announcementMedia = await Announcement.find({
      cg_id: id,
      postType: { $in: ['image', 'video'] },
    })
      .select('postType media caption createdAt')
      .sort({ createdAt: -1 });

    // Combine and sort all media posts by createdAt (descending)
    const allMediaPosts = [...communityMedia, ...announcementMedia].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    res.status(200).json(allMediaPosts);
  } catch (err) {
    console.error('Error fetching media posts:', err);
    res.status(500).json({ message: 'Server Error' });
  }
});


//messages in discussion !

router.get("/discussions",(req, res) => {
  console.log("arey ikkade unnara ");
  res.send("HEllow");
});


//announcement code below !

// Get all announcements for a community
router.get("/get/announcements/:communityId", async (req, res) => {
  try {
    console.log("Fetching announcements for community:", req.params.communityId);

    const announcements = await Announcement.find({
      cg_id: req.params.communityId,
    })
      .sort({ createdAt: -1 })
      .populate("user", "name username profilePic"); // corrected from "createdBy"

      console.log(announcements);
    res.status(200).json(announcements);
  } catch (err) {
    console.log(`err: ${err}`);
    res.status(500).json({ error: err.message });
  }
});



// Route: /post/announcements/:id
router.post("/post/announcements/:id", async (req, res) => {
  try {
    const { userId, cgId, caption, media } = req.body;

    if (!userId || !cgId) {
      return res.status(400).json({ message: "userId and comId are required" });
    }

    let postType = "text";
    let mediaUrl = null;

    if (media) {
      mediaUrl = media;
      const isVideo = media.includes(".mp4") || media.includes("video");
      const isImage = media.includes(".jpg") || media.includes(".png") || media.includes("image");
      postType = isVideo ? "video" : isImage ? "image" : "text";
    }

    const newAnnouncement = new Announcement({
      user: userId,
      cg_id:cgId,
      caption,
      postType,
      media: mediaUrl,
    });

    console.log(newAnnouncement);

    await newAnnouncement.save();

    res.status(201).json({ message: "Announcement created successfully!", announcement: newAnnouncement });
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).json({ message: "Unexpected Error", error: error.message });
  }
});



// Get recent image posts for a community
// router.get('/:id/recent-photos', async (req, res) => {
//   try {
//     const communityId = req.params.id;

//     const recentPhotos = await CommunityPosts.find({
//       group_id: communityId,
//       postType: 'image',
//       media: { $exists: true, $ne: '' },
//     })
//       .sort({ createdAt: -1 })
//       .limit(5)
//       .select('media createdAt');

//     res.status(200).json(recentPhotos);
//   } catch (error) {
//     console.error('Error fetching recent photos:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

router.get('/:id/recent-photos', async (req, res) => {
  try {
    const communityId = req.params.id;

    // Get image posts from CommunityPosts
    const communityPhotosPromise = CommunityPosts.find({
      group_id: communityId,
      postType: 'image',
      media: { $exists: true, $ne: '' },
    })
      .select('media createdAt')
      .lean(); // lean makes it a plain JS object for easier merging

    // Get image posts from Announcements
    const announcementPhotosPromise = Announcement.find({
      cg_id: communityId,
      postType: 'image',
      media: { $exists: true, $ne: '' },
    })
      .select('media createdAt')
      .lean();

    // Await both promises in parallel
    const [communityPhotos, announcementPhotos] = await Promise.all([
      communityPhotosPromise,
      announcementPhotosPromise,
    ]);

    // Combine both arrays
    const combined = [...communityPhotos, ...announcementPhotos];

    // Sort combined by createdAt descending and get the latest 5
    const latestFive = combined
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);

    res.status(200).json(latestFive);
  } catch (error) {
    console.error('Error fetching recent photos:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

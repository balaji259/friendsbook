const express = require("express");
const multer = require("multer");
const Group = require("../models/group"); // Import the Group model
const GroupPosts=require("../models/groupposts");
const router = express.Router();
const Announcement = require("../models/announcements");
const Discussion=require('../models/discussion');

// const cloudinary = require('../cloudinaryConfig');
const formidable = require("formidable");
// const cloudinary = require("cloudinary").v2;

const cloudinary = require('../cloudinaryConfig');



const fs = require("fs");
const path = require("path");
const multiparty = require("multiparty");

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

        
        const newGroup = new Group({
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
        console.log(newGroup);

 

        await newGroup.save();

        res.status(201).json({ message: "Group created successfully!", group: newGroup });
      } catch (error) {
        console.error("Error creating Group:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
      }
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).json({ message: "Unexpected Error", error: error.message });
  }
});

// GET all groups of user
router.get("/get/groups/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const groups = await Group.find({ members: userId }).populate("members posts");
    res.json(groups);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

//get all existing groups

router.get("/get/all", async (req, res) => {
  try {
    const communities = await Group.find().populate("members posts");
    res.json(communities);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});


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
        visibility, // Fixed: Previously privacy was undefined
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

        
        const newGroup = new Group({
          name,
          category,
          description,
          profilePicture: profilePictureUrl,
          coverPhoto: coverPhotoUrl,
          createdBy,
          visibility: visibility || "public",
          joinMethod: joinMethod || "anyone",
          permissions: {
            allowPosts: allowPosts === "true",
            allowComments: allowComments === "true",
            requireApproval: requireApproval === "true",
          },
        });

        await newGroup.save();

        res.status(201).json({ message: "Group created successfully!", group: newGroup });
      } catch (error) {
        console.error("Error creating group:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
      }
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).json({ message: "Unexpected Error", error: error.message });
  }
});


router.get("/get/:groupId", async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId)
      .populate("admins", "name")
      .populate({
        path: "posts",
        populate: { path: "user", select: "name" }
      });

    if (!group) return res.status(404).json({ error: "Group not found" });

    res.json(group);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});


// Join Group
router.post("/:groupId/join", async (req, res) => {
  try {
    const { userId } = req.body;
    const { groupId } = req.params;

    console.log(userId);
    console.log(groupId);

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Check if user is already a member
    if (group.members.includes(userId)) {
      return res.status(400).json({ message: "User is already a member" });
    }

    // Add user to group
    group.members.push(userId);
    await group.save();

    res.status(200).json({ message: "Joined the group successfully", group });
  } catch (error) {
    console.error("Error joining group:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Route to get the last 3 members who joined a community
router.get("/:id/recent-members", async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find the community and get the last 3 members
    const group = await Group.findById(id).populate({
      path: "members",
      options: { sort: { _id: -1 }, limit: 3 }, // Assuming _id follows insertion order
    });

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    res.json({ recentMembers: group.members });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:id/admins", async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find the community and get the last 3 members
    const group = await Group.findById(id).populate({
      path: "admins",
      options: { sort: { _id: -1 }, limit: 3 }, // Assuming _id follows insertion order
    });

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    res.json({ admins: group.admins });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});


router.post("/:id/leave", async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    const group = await Group.findById(id);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Check if the user is a member
    if (!group.members.includes(userId)) {
      return res.status(400).json({ message: "You are not a member of this group" });
    }

    // Remove user from members list
    group.members = group.members.filter((member) => member.toString() !== userId);

    await group.save();

    res.json({ message: "Successfully left the group" });
  } catch (error) {
    console.error("Error leaving group:", error);
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

          const post = new GroupPosts({
              user: userId,
              group_id: groupId,
              postType,
              caption,
              media: mediaUrl,
          });

          console.log(post);

          await post.save();

           // 🔥 Increment postCount and add post reference in group
      await Group.findByIdAndUpdate(groupId, {
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


router.get('/posts/:groupId', async (req, res) => {
  try {

    const {groupId} = req.params;

    const posts = await GroupPosts.find( {group_id: groupId} )
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
    const group = await Group.findById(req.params.id).populate({
      path: "members",
      select: "fullname email profilePic", // 👈 use fields from your User schema
    });

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    console.log("Fetched members:", group.members);

    res.json(group.members);
  } catch (err) {
    console.error("Error fetching members:", err);
    res.status(500).json({ message: "Server error" });
  }
});


router.get('/:id/media', async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch media posts from CommunityPosts
    const groupMedia = await GroupPosts.find({
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
    const allMediaPosts = [...groupMedia, ...announcementMedia].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    res.status(200).json(allMediaPosts);
  } catch (err) {
    console.error('Error fetching media posts:', err);
    res.status(500).json({ message: 'Server Error' });
  }
});


// Get all announcements for a group
router.get("/get/announcements/:groupId", async (req, res) => {
  try {
    console.log("Fetching announcements for group:", req.params.groupId);

    const announcements = await Announcement.find({
      cg_id: req.params.groupId,
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
    const { userId, comId, caption, media } = req.body;

    if (!userId || !comId) {
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
      cg_id: comId,
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


// Get recent image posts for a group 
router.get('/:id/recent-photos', async (req, res) => {
  try {
    const groupId = req.params.id;

    // Get image posts from GroupPosts
    const groupPhotosPromise = GroupPosts.find({
      group_id: groupId,
      postType: 'image',
      media: { $exists: true, $ne: '' },
    })
      .select('media createdAt')
      .lean(); // lean makes it a plain JS object for easier merging


    // Get image posts from Announcements
    const announcementPhotosPromise = Announcement.find({
      cg_id: groupId,
      postType: 'image',
      media: { $exists: true, $ne: '' },
    })
      .select('media createdAt')
      .lean();

      // Await both promises in parallel
    const [groupPhotos, announcementPhotos] = await Promise.all([
      groupPhotosPromise,
      announcementPhotosPromise,
    ]);


     // Combine both arrays
     const combined = [...groupPhotos, ...announcementPhotos];

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

const express = require("express");
const router = express.Router();
const Event = require("../models/Event");




router.post("/create", async (req, res) => {
    const { title, time, message, tags, cgId } = req.body;
  
    console.log(req.body);

    if (!title || !time || !message || !cgId)  {
      return res.status(400).json({ error: "All fields are required." });
    }
  
    try {
      const newEvent = new Event({ title, time, message, tags, cgId });
      await newEvent.save();
      res.status(201).json({ message: "Event created successfully", event: newEvent });
    } catch (err) {
      console.error("Error creating event:", err);
      res.status(500).json({ error: "Server error" }); 
    }
  });


// GET all events
router.get('/:id', async (req, res) => {
  try {
    console.log(req.params.id)
    const events = await Event.find({ cgId: req.params.id }).sort({ time: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching events', error: err.message });
  }
});



  module.exports=router;
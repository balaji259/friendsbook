const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  
  cgId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
 
  },

  title: {
    type: String,
    required: true,
  },
  time: {
    type: Date,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  tags: {
    type: [String],
    default: [],
  },
}, {
  timestamps: true
});

module.exports = mongoose.model("Event", eventSchema);

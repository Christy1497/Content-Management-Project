const mongoose = require("mongoose");

// Define the user roles
const ROLES = {
  ADMIN: 'admin',
  EDITOR: 'editor',
  VIEWER: 'viewer'
};


const contentSchema = new mongoose.Schema({
  title: {
    required: true,
    type: String,
  },
  description: {
    required: true,
    type: String,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
     enum: Object.values(ROLES)
  },
});

module.exports = mongoose.model("Posts", contentSchema);
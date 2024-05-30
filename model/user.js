const mongoose = require("mongoose");

// Define the user roles
const ROLES = {
  ADMIN: 'admin',
  EDITOR: 'editor',
  VIEWER: 'viewer'
};

const usersSchema = new mongoose.Schema({
  firstname: {
    required: true,
    type: String,
  },
  lastname: {
    required: true,
    type: String,
  },
  email: {
    required: true,
    type: String,
  },
  password: {
    required: true,
    type: String,
  },
  role: {
    required: true,
    type: String,
    enum: Object.values(ROLES),
     default: ROLES.VIEWER
  }
  
});

module.exports = mongoose.model("Users", usersSchema);
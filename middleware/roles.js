// Importing jsonwebtoken module for token generation
const jwt = require("jsonwebtoken");

// Defining a middleware function for checking user roles
const checkUserRole = (roles) => {
  return (req, res, next) => {
    // Extracting the user object from the request body
    const user = req.body;

    // Checking if the user has the required role
    if (roles.includes(user.role)) {
      // If the user has the required role, call the next middleware function
      next();
    } else {
      // If the user does not have the required role, return an error response with a 403 status code
      res.status(403).send({ error: true, message: "Forbidden" });
    }
  };
};

// Exporting the checkUserRole middleware
module.exports = checkUserRole;
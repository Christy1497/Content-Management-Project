const jwt = require("jsonwebtoken");

authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(403)
    .send({ error: true, message: "no token provided" });
  }

  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log(err);
      return res
        .status(401)
        .send({ error: true, message: "Unauthorized access" });
    }

    // Define the authorization middleware
const authorize = (role) => {
  return (req, res, next) => {
    if (req.user.role!== role) {
      return res.status(403)
      .send({ error: true, message: 'Forbidden' });
    }

    req.userId = decoded.id;
    next();
  }}
  

  //next();
});
};
module.exports = authMiddleware;
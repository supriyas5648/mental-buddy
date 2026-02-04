//this is a Node.js middleware that verifies JSON Web Tokens (JWT) for authentication purposes

const jwt = require("jsonwebtoken");
//This library is used to create and verify JSON Web Tokens (JWTs).


module.exports = function (req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ msg: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ msg: "Invalid token" });
  }
};

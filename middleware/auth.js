const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function auth(req, res, next) {
  const token = req.headers["auth-token"];
  if (!token) {
    res.status(400).send("No token provided!");
  }
  try {
    const decoded = jwt.verify(token, config.get("jwtKey"));
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).send(error.message);
  }
};

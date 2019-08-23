const jwt = require("jsonwebtoken");
const config = require("config");

function auth(req, res, next) {
  // define token
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send("Access Denied. No token provided!");

  try {
    // verify header token against the environment defined privateKey
    const decodedPayload = jwt.verify(token, config.get("jwtPrivateKey"));
    req.user = decodedPayload;
    next();
  } catch (err) {
    res.status(400).send("Inavlid Token");
  }
}

module.exports = auth;

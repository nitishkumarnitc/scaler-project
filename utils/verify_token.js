const jwt = require("jsonwebtoken");

const verify_token = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      return false;
    } else {
      return decoded;
    }
  });
};
module.exports = verify_token;

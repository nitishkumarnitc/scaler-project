const responseStatus = require("../handlers/response_status.handler");
const Admin = require("../models/Staff/admin.model");

const is_admin = async (req, res, next) => {
  const userId = req.userAuth.id;
  //const admin = await Admin.findById(userId);
  const admin = {
    role: "admin",
  }
  if (admin.role === "admin") {
    next();
  } else {
    responseStatus(res, 403, "failed", "Access Denied.admin only route!");
  }
};
module.exports = is_admin;

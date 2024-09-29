const responseStatus = require("../handlers/response_status.handler");
const Instructor = require("../models/Staff/instructors.model");

const is_instructor = async (req, res, next) => {
  const userId = req.userAuth.id;
  const instructor = await Instructor.findById(userId);
  if (instructor?.role === "instructor") {
    next();
  } else {
    responseStatus(res, 403, "failed", "Access Denied.instructors only route!");
  }
};
module.exports = is_instructor;

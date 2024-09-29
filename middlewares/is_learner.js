const responseStatus = require("../handlers/response_status.handler");
const Instructor = require("../models/Staff/instructors.model");

const isInstructor = async (req, res, next) => {
  const userId = req.userAuth.id;
  const instructor = await Instructor.findById(userId);
  if (instructor?.role === "learner") {
    next();
  } else {
    responseStatus(res, 403, "failed",  "Access restricted to instructors only.");
  }
};
module.exports = isInstructor;

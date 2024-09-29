const responseStatus = require("../handlers/response_status.handler");
const Teacher = require("../models/Staff/teachers.model");

const is_teacher = async (req, res, next) => {
  const userId = req.userAuth.id;
  const teacher = await Teacher.findById(userId);
  if (teacher?.role === "teacher") {
    next();
  } else {
    responseStatus(res, 403, "failed", "Access Denied.teachers only route!");
  }
};
module.exports = is_teacher;

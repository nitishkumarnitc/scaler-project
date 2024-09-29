const express = require("express");
const teachersRouter = express.Router();
//middleware
const isLoggedIn = require("../../../middlewares/is_logged_in");
const isAdmin = require("../../../middlewares/is_admin");
const isTeacher = require("../../../middlewares/is_teacher");
//controllers
const {
  createTeacherController,
  teacherLoginController,
  getAllTeachersController,
  getTeacherProfileController,
  updateTeacherProfileController,
  adminUpdateTeacherProfileController,
} = require("../../../controllers/staff/teachers.controller");
// create teacher
teachersRouter
  .route("/create-teacher")
  .post(isLoggedIn, isAdmin, createTeacherController);
// teacher login
teachersRouter.route("/teacher/login").post(teacherLoginController);
//get all teachers
teachersRouter
  .route("/teachers")
  .get(isLoggedIn, isAdmin, getAllTeachersController);
// get teacher profile
teachersRouter
  .route("/teacher/:teacherId/profile")
  .get(isLoggedIn, isTeacher, getTeacherProfileController);
// teacher update own profile
teachersRouter
  .route("/teacher/update-profile")
  .patch(isLoggedIn, isTeacher, updateTeacherProfileController);
// admin update user profile
teachersRouter
  .route("/teacher/:teachersId/update-profile")
  .patch(isLoggedIn, isAdmin, adminUpdateTeacherProfileController);

module.exports = teachersRouter;

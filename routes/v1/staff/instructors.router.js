const express = require("express");
const instructorsRouter = express.Router();
//middleware
const isLoggedIn = require("../../../middlewares/is_logged_in");
const isAdmin = require("../../../middlewares/is_admin");
const isInstructor = require("../../../middlewares/is_instructor");
//controllers
const {
  createInstructorController,
  instructorLoginController,
  getAllInstructorsController,
  getInstructorProfileController,
  updateInstructorProfileController,
  adminUpdateInstructorProfileController,
} = require("../../../controllers/staff/instructor.controller");
// create instructor
instructorsRouter
  .route("/create-instructor")
  .post(isLoggedIn, isAdmin, createInstructorController);
// instructor login
instructorsRouter.route("/instructor/login").post(instructorLoginController);
//get all instructors
instructorsRouter
  .route("/instructors")
  .get(isLoggedIn, isAdmin, getAllInstructorsController);
// get instructor profile
instructorsRouter
  .route("/instructor/:instructorId/profile")
  .get(isLoggedIn, isInstructor, getInstructorProfileController);
// instructor update own profile
instructorsRouter
  .route("/instructor/update-profile")
  .patch(isLoggedIn, isInstructor, updateInstructorProfileController);
// admin update user profile
instructorsRouter
  .route("/instructor/:instructorsId/update-profile")
  .patch(isLoggedIn, isAdmin, adminUpdateInstructorProfileController);

module.exports = instructorsRouter;

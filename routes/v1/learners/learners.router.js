const express = require("express");
const learnersRouter = express.Router();

// Middleware
const isLoggedIn = require("../../../middlewares/is_logged_in");
const isAdmin = require("../../../middlewares/is_admin");
const isLearner = require("../../../middlewares/is_learner");

// Controllers
const {
  adminRegisterLearnerController,
  studentLoginController,
  getLearnerProfileController,
  getAllLearnersByAdminController,
  getLearnerByAdminController,
  studentUpdateProfileController,
  adminUpdateLearnerController,
  studentWriteExamController,
} = require("../../../controllers/learners/learners.controller");

// Create Learner by Admin
learnersRouter
  .route("/learners/admin/register")
  .post(isLoggedIn, isAdmin, adminRegisterLearnerController);

// Learner Login
learnersRouter.route("/learners/login").post(studentLoginController);

// Get Learner Profile
learnersRouter
  .route("/learners/profile")
  .get(isLoggedIn, isLearner, getLearnerProfileController);

// Get All Learners by Admin
learnersRouter
  .route("/admin/learners")
  .get(isLoggedIn, isAdmin, getAllLearnersByAdminController);

// Get Single Learner by Admin
learnersRouter
  .route("/:studentId/admin")
  .get(isLoggedIn, isAdmin, getLearnerByAdminController);

// Update Learner Profile by Learner
learnersRouter
  .route("/update")
  .patch(isLoggedIn, isLearner, studentUpdateProfileController);

// Admin Update Learner Profile
learnersRouter
  .route("/:studentId/update/admin")
  .patch(isLoggedIn, isAdmin, adminUpdateLearnerController);

// learner write exam
learnersRouter
  .route("/learners/:examId/exam-write")
  .post(isLoggedIn, isLearner, studentWriteExamController);

module.exports = learnersRouter;

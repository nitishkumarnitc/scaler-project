const express = require("express");
const resultsRouter = express.Router();
// middleware
const isLoggedIn = require("../../../middlewares/is_logged_in");
const isLearner = require("../../../middlewares/is_learner");
const isInstructor = require("../../../middlewares/is_instructor");
// controllers
const {
  studentCheckExamResultController,
  getAllExamResultsController,
} = require("../../../controllers/academic/results.controller");
// learner check exam result
resultsRouter
  .route("/exam-result/:examId/check")
  .post(isLoggedIn, isLearner, studentCheckExamResultController);
//   Instructor get all exam result
resultsRouter
  .route("/exam-results/:classLevelId")
  .get(isLoggedIn, isInstructor, getAllExamResultsController);

module.exports = resultsRouter;

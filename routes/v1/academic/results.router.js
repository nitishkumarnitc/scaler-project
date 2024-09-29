const express = require("express");
const resultsRouter = express.Router();
// middleware
const isLoggedIn = require("../../../middlewares/is_logged_in");
const isStudent = require("../../../middlewares/is_student");
const isTeacher = require("../../../middlewares/is_teacher");
// controllers
const {
  studentCheckExamResultController,
  getAllExamResultsController,
} = require("../../../controllers/academic/results.controller");
// student check exam result
resultsRouter
  .route("/exam-result/:examId/check")
  .post(isLoggedIn, isStudent, studentCheckExamResultController);
//   Teacher get all exam result
resultsRouter
  .route("/exam-results/:classLevelId")
  .get(isLoggedIn, isTeacher, getAllExamResultsController);

module.exports = resultsRouter;

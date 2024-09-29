const express = require("express");
const examRouter = express.Router();
// middlewares
const isLoggedIn = require("../../../middlewares/is_logged_in");
const isInstructor = require("../../../middlewares/is_instructor");
// controller
const {
  createExamController,
  getAllExamController,
  getExamByIdController,
  updateExamController,
} = require("../../../controllers/academic/exams.controller");
// instructor create exam
examRouter
  .route("/exams")
  .get(isLoggedIn, isInstructor, getAllExamController)
  .post(isLoggedIn, isInstructor, createExamController);
examRouter
  .route("/exams/:examId")
  .get(isLoggedIn, isInstructor, getExamByIdController)
  .patch(isLoggedIn, isInstructor, updateExamController);

module.exports = examRouter;

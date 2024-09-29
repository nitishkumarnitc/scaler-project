const express = require("express");
const questionsRouter = express.Router();
//middleware
const isLoggedIn = require("../../../middlewares/is_logged_in");
const isTeacher = require("../../../middlewares/is_teacher");
const {
  createQuestionsController,
  getAllQuestionsController,
  getQuestionByIdController,
  updateQuestionController,
} = require("../../../controllers/academic/questions.controller");

questionsRouter
  .route("/question")
  .get(isLoggedIn, isTeacher, getAllQuestionsController);
questionsRouter
  .route("/questions/:examId/create")
  .post(isLoggedIn, isTeacher, createQuestionsController);
questionsRouter
  .route("/question/:id")
  .get(isLoggedIn, isTeacher, getQuestionByIdController)
  .patch(isLoggedIn, isTeacher, updateQuestionController);

module.exports = questionsRouter;

const express = require("express");
const questionsRouter = express.Router();
//middleware
const isLoggedIn = require("../../../middlewares/is_logged_in");
const isInstructor = require("../../../middlewares/is_instructor");
const {
  createQuestionsController,
  getAllQuestionsController,
  getQuestionByIdController,
  updateQuestionController,
} = require("../../../controllers/academic/questions.controller");

questionsRouter
  .route("/question")
  .get(isLoggedIn, isInstructor, getAllQuestionsController);
questionsRouter
  .route("/questions/:examId/create")
  .post(isLoggedIn, isInstructor, createQuestionsController);
questionsRouter
  .route("/question/:id")
  .get(isLoggedIn, isInstructor, getQuestionByIdController)
  .patch(isLoggedIn, isInstructor, updateQuestionController);

module.exports = questionsRouter;

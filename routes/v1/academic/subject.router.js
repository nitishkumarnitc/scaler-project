const express = require("express");
const subjectRouter = express.Router();
// middlewares
const isAdmin = require("../../../middlewares/is_admin");
const isLoggedIn = require("../../../middlewares/is_logged_in");
// controllers
const {
  getSubjectsController,
  getSubjectController,
  updateSubjectController,
  deleteSubjectController,
  createSubjectController,
} = require("../../../controllers/academic/subject.controller");

subjectRouter.route("/subject").get(isLoggedIn, isAdmin, getSubjectsController);
subjectRouter
  .route("/subject/:id")
  .get(isLoggedIn, isAdmin, getSubjectController)
  .patch(isLoggedIn, isAdmin, updateSubjectController)
  .delete(isLoggedIn, isAdmin, deleteSubjectController);
subjectRouter
  .route("/create-subject/:programId")
  .post(isLoggedIn, isAdmin, createSubjectController);

module.exports = subjectRouter;

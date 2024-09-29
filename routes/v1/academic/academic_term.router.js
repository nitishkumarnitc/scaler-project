const express = require("express");
const academic_termRouter = express.Router();
// middleware
const isAdmin = require("../../../middlewares/is_admin");
const isLoggedIn = require("../../../middlewares/is_logged_in");
const {
  getAcademicTermsController,
  createAcademicTermController,
  getAcademicTermController,
  updateAcademicTermController,
  deleteAcademicTermController,
} = require("../../../controllers/academic/academic_term.controller");

academic_termRouter
  .route("/academic-term")
  .get(isLoggedIn, isAdmin, getAcademicTermsController)
  .post(isLoggedIn, isAdmin, createAcademicTermController);
academic_termRouter
  .route("/academic-term/:id")
  .get(isLoggedIn, isAdmin, getAcademicTermController)
  .patch(isLoggedIn, isAdmin, updateAcademicTermController)
  .delete(isLoggedIn, isAdmin, deleteAcademicTermController);
module.exports = academic_termRouter;

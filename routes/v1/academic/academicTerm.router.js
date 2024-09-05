const express = require("express");
const academicTermRouter = express.Router();
// middleware
const isAdmin = require("../../../middlewares/isAdmin");
const isLoggedIn = require("../../../middlewares/isLoggedIn");
const {
  getAcademicTermsController,
} = require("../../../controllers/academic/academicTerm.controller");

academicTermRouter
  .route("/academic-term")
  .get(isLoggedIn, isAdmin, getAcademicTermsController);
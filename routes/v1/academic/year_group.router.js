const express = require("express");
const year_groupRouter = express.Router();
// middlewares
const isAdmin = require("../../../middlewares/is_admin");
const isLoggedIn = require("../../../middlewares/is_logged_in");
// controller
const {
  getYearGroupsController,
  createYearGroupController,
  getYearGroupController,
  updateYearGroupController,
  deleteYearGroupController,
} = require("../../../controllers/academic/year_group.controller");

year_groupRouter
  .route("/year-group")
  .get(isLoggedIn, isAdmin, getYearGroupsController)
  .post(isLoggedIn, isAdmin, createYearGroupController);

year_groupRouter
  .route("/year-group/:id")
  .get(isLoggedIn, isAdmin, getYearGroupController)
  .patch(isLoggedIn, isAdmin, updateYearGroupController)
  .delete(isLoggedIn, isAdmin, deleteYearGroupController);

module.exports = year_groupRouter;

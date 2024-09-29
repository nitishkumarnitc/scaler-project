const express = require("express");
const classRouter = express.Router();
// middleware
const isAdmin = require("../../../middlewares/is_admin");
const isLoggedIn = require("../../../middlewares/is_logged_in");
// controllers
const {
  getClassLevelsController,
  createClassLevelController,
  getClassLevelController,
  updateClassLevelController,
  deleteClassLevelController,
} = require("../../../controllers/academic/class.controller");

classRouter
  .route("/class-levels")
  .get(isLoggedIn, isAdmin, getClassLevelsController)
  .post(isLoggedIn, isAdmin, createClassLevelController);
classRouter
  .route("/class-levels/:id")
  .get(isLoggedIn, isAdmin, getClassLevelController)
  .patch(isLoggedIn, isAdmin, updateClassLevelController)
  .delete(isLoggedIn, isAdmin, deleteClassLevelController);

module.exports = classRouter;

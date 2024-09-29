const express = require("express");
const {
  registerAdminController,
  loginAdminController,
  getAdminsController,
  updateAdminController,
  deleteAdminController,
  adminSuspendInstructorController,
  adminUnSuspendInstructorController,
  adminWithdrawInstructorController,
  adminUnWithdrawInstructorController,
  adminUnPublishResultsController,
  getAdminProfileController,
} = require("../../../controllers/staff/admin.controller");
const adminRouter = express.Router();
// middleware
const isLoggedIn = require("../../../middlewares/is_logged_in");
const isAdmin = require("../../../middlewares/is_admin");

// register
adminRouter
  .route("/admin/register")
  .post(isLoggedIn, isAdmin, registerAdminController);
//  login
adminRouter.route("/admin/login").post(loginAdminController);
// get all admin
adminRouter.route("/admins").get(isLoggedIn, isAdmin, getAdminsController);
//get current admin profile
adminRouter.route("/admin/profile").get(isLoggedIn, getAdminProfileController);
// update/delete admin
adminRouter
  .route("/admin/:id")
  .put(isLoggedIn, isAdmin, updateAdminController)
  .delete(deleteAdminController);
// admin suspend a instructor
adminRouter
  .route("/admins/suspend/instructor/:id")
  .put(adminSuspendInstructorController);
// admin unsuspend a instructor
adminRouter
  .route("/admins/unsuspend/instructor/:id")
  .put(adminUnSuspendInstructorController);
//  admin withdraws a instructor
adminRouter
  .route("/admins/withdraw/instructor/:id")
  .put(adminWithdrawInstructorController);
// admin un-withdraws a instructor
adminRouter
  .route("/admins/unwithdraw/instructor/:id")
  .put(adminUnWithdrawInstructorController);
// admin publish result
adminRouter
  .route("/admins/publish/result/:id")
  .put(adminUnPublishResultsController);
// admin un-publish result
adminRouter
  .route("/admins/unpublish/result/:id")
  .put(adminUnPublishResultsController);

module.exports = adminRouter;

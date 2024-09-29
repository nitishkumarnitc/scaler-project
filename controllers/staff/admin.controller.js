const responseStatus = require("../../handlers/response_status.handler");
const {
  registerAdminService,
  getAdminsService,
  loginAdminService,
  getSingleProfileService,
  updateAdminService,
} = require("../../services/staff/admin.service");

/**
 * @desc Register Admin
 * @route POST /api/v1/admin/register
 * @access Private(admin)
 **/
exports.registerAdminController = async (req, res) => {
  try {
    await registerAdminService(req.body, res);
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

/**
 * @desc Login Admin
 * @route POST /api/v1/admin/login
 * @access Private
 **/
exports.loginAdminController = async (req, res) => {
  try {
    await loginAdminService(req.body, res);
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

/**
 * @desc Get all admins
 * @route GET /api/v1/admins
 * @access Private
 **/
exports.getAdminsController = async (req, res) => {
  try {
    const result = await getAdminsService();
    responseStatus(res, 201, "success", result);
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

/**
 * @desc Get current admin
 * @route GET /api/v1/admin/profile
 * @access Private
 **/
exports.getAdminProfileController = async (req, res) => {
  try {
    await getSingleProfileService(req.userAuth.id, res);
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

/**
 * @desc Update admin
 * @route PUT /api/v1/admin/:id
 * @access Private
 **/
exports.updateAdminController = async (req, res) => {
  try {
    await updateAdminService(req.userAuth.id, req.body, res);
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

/**
 * @desc Delete admin
 * @route DELETE /api/v1/admins/:id
 * @access Private
 **/
exports.deleteAdminController = (req, res) => {
  try {
    res.status(201).json({
      status: "success",
      data: "delete admin",
    });
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

/**
 * @desc Admin suspends a instructor
 * @route PUT /api/v1/admins/suspend/instructor/:id
 * @access Private
 **/
exports.adminSuspendInstructorController = (req, res) => {
  try {
    res.status(201).json({
      status: "success",
      data: "admin suspend instructor",
    });
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

/**
 * @desc Admin unsuspends a instructor
 * @route PUT /api/v1/admins/unsuspend/instructor/:id
 * @access Private
 **/
exports.adminUnSuspendInstructorController = (req, res) => {
  try {
    res.status(201).json({
      status: "success",
      data: "admin unsuspend instructor",
    });
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

/**
 * @desc Admin withdraws a instructor
 * @route PUT /api/v1/admins/withdraw/instructor/:id
 * @access Private
 **/
exports.adminWithdrawInstructorController = (req, res) => {
  try {
    res.status(201).json({
      status: "success",
      data: "admin withdraw instructor",
    });
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

/**
 * @desc Admin un-withdraws a instructor
 * @route PUT /api/v1/admins/unwithdraw/instructor/:id
 * @access Private
 **/
exports.adminUnWithdrawInstructorController = (req, res) => {
  try {
    res.status(201).json({
      status: "success",
      data: "admin un-withdraw instructor",
    });
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

/**
 * @desc Admin publishes exam result
 * @route PUT /api/v1/admins/publish/result/:id
 * @access Private
 **/
exports.adminPublishResultsController = (req, res) => {
  try {
    res.status(201).json({
      status: "success",
      data: "admin publish exam",
    });
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

/**
 * @desc Admin un-publishes exam result
 * @route PUT /api/v1/admins/unpublish/result/:id
 * @access Private
 **/
exports.adminUnPublishResultsController = (req, res) => {
  try {
    res.status(201).json({
      status: "success",
      data: "admin unpublish exam",
    });
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

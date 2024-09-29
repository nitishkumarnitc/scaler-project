const responseStatus = require("../../handlers/response_status.handler");
const {
  createInstructorService,
  instructorLoginService,
  getAllInstructorsService,
  getInstructorProfileService,
  updateInstructorProfileService,
  adminUpdateInstructorProfileService,
} = require("../../services/staff/instructors.service");

/**
 * @description Admin create instructor
 * @route POST /api/v1/create-instructor
 * @access Private (admin)
 **/
exports.createInstructorController = async (req, res) => {
  try {
    await createInstructorService(req.body, req.userAuth.id, res);
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

/**
 * @description Instructor login
 * @route POST /api/v1/instructor/login
 * @access Public
 **/
exports.instructorLoginController = async (req, res) => {
  try {
    await instructorLoginService(req.body, res);
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

/**
 * @description Get all instructors
 * @route GET /api/v1/instructors
 * @access Private (admin)
 **/
exports.getAllInstructorsController = async (req, res) => {
  try {
    const result = await getAllInstructorsService();
    responseStatus(res, 200, "success", result);
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

/**
 * @description Get instructor profile
 * @route GET /api/v1/instructor/profile
 * @access Private (instructor)
 **/
exports.getInstructorProfileController = async (req, res) => {
  try {
    const result = await getInstructorProfileService(req.params.instructorId);
    responseStatus(res, 200, "success", result);
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

/**
 * @description Update instructor profile
 * @route PATCH /api/v1/instructor/update-profile
 * @access Private (Instructor)
 **/
exports.updateInstructorProfileController = async (req, res) => {
  try {
    const result = await updateInstructorProfileService(
      req.body,
      req.userAuth.id,
      res
    );
    responseStatus(res, 200, "success", result);
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

/**
 * @description Admin update instructor profile
 * @route PATCH /api/v1/instructor/:instructorsId/update-profile
 * @access Private (Admin)
 **/
exports.adminUpdateInstructorProfileController = async (req, res) => {
  try {
    const result = await adminUpdateInstructorProfileService(
      req.body,
      req.params.instructorsId
    );
    responseStatus(res, 200, "success", result);
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

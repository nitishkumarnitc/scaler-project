const responseStatus = require("../../handlers/response_status.handler");
const {
  adminRegisterLearnerService,
  studentLoginService,
  getLearnersProfileService,
  getAllLearnersByAdminService,
  getLearnerByAdminService,
  studentUpdateProfileService,
  adminUpdateLearnerService,
  studentWriteExamService,
} = require("../../services/learners/learners.service");

/**
 * @description Admin Register Learner
 * @route POST /api/learners/admin/register
 * @access Private Admin only
 **/
exports.adminRegisterLearnerController = async (req, res) => {
  try {
    await adminRegisterLearnerService(req.body, req.userAuth.id, res);
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

/**
 * @description Login learner
 * @route POST /api/v1/learners/login
 * @access Public
 **/
exports.studentLoginController = async (req, res) => {
  try {
    await studentLoginService(req.body, res);
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

/**
 * @description Learner Profile
 * @route GET /api/v1/learners/profile
 * @access Private Learner only
 **/
exports.getLearnerProfileController = async (req, res) => {
  try {
    await getLearnersProfileService(req.userAuth.id, res);
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

/**
 * @description Get all Learners
 * @route GET /api/v1/admin/learners
 * @access Private admin only
 **/
exports.getAllLearnersByAdminController = async (req, res) => {
  try {
    await getAllLearnersByAdminService(req.userAuth.id, res);
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

/**
 * @description Get Single Learner
 * @route GET /api/v1/learners/:studentID/admin
 * @access Private admin only
 **/
exports.getLearnerByAdminController = async (req, res) => {
  try {
    const result = await getLearnerByAdminService(req.userAuth.id);
    responseStatus(res, 200, "success", result);
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

/**
 * @description Learner updating profile
 * @route UPDATE /api/v1/learners/update
 * @access Private Learner only
 **/
exports.studentUpdateProfileController = async (req, res) => {
  try {
    await studentUpdateProfileService(req.body, req.userAuth.id, res);
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

/**
 * @description Admin updating Learners eg: Assigning classes....
 * @route UPDATE /api/v1/learners/:studentID/update/admin
 * @access Private Admin only
 **/
exports.adminUpdateLearnerController = async (req, res) => {
  try {
    await adminUpdateLearnerService(req.body, req.params.studentId);
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

/**
 * @description Learners taking exams
 * @route POST /api/v1/learners/:examId/exam-write
 * @access Private Learners only
 **/
exports.studentWriteExamController = async (req, res) => {
  try {
    await studentWriteExamService(
      req.body,
      req.userAuth.id,
      req.params.examId,
      res
    );
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

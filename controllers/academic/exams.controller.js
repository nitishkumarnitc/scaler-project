const responseStatus = require("../../handlers/response_status.handler");
const {
  getAllExamService,
  createExamService,
  getExamByIdService,
  updateExamService,
} = require("../../services/academic/exams.service");

/**
 * @description Create new exam
 * @route POST /api/v1/exams
 * @access Private (Instructor Only)
 **/
exports.createExamController = async (req, res) => {
  try {
    await createExamService(req.body, req.userAuth.id, res);
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

/**
 * @description Get all exams
 * @route GET /api/v1/exams
 * @access Private (Instructor Only)
 **/
exports.getAllExamController = async (req, res) => {
  try {
    const result = await getAllExamService();
    responseStatus(res, 200, "success", result);
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

/**
 * @description Get exam by ID
 * @route GET /api/v1/exams/:examId
 * @access Private (Instructor Only)
 **/
exports.getExamByIdController = async (req, res) => {
  try {
    const result = await getExamByIdService(req.params.examId);
    responseStatus(res, 200, "success", result);
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

/**
 * @description Update Exam
 * @route PATCH /api/v1/exams/:id
 * @access Private (Instructor Only)
 **/
exports.updateExamController = async (req, res) => {
  try {
    await updateExamService(req.body, req.params.examId, res);
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

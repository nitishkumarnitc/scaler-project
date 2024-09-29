const responseStatus = require("../../handlers/response_status.handler");
const {
  createExamService,
  getAllQuestionsService,
  getQuestionsByIdService,
  updateQuestionsService,
} = require("../../services/academic/questions.service");

/**
 * @description Create Question
 * @route POST /questions/:examId/create
 * @access Private (Instructors Only)
 **/
exports.createQuestionsController = async (req, res) => {
  try {
    await createExamService(req.body, req.params.examId, req.userAuth.id, res);
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

/**
 * @description Get all questions
 * @route GET /api/v1/questions
 * @access Private - Instructor only
 **/
exports.getAllQuestionsController = async (req, res) => {
  try {
    const result = await getAllQuestionsService();
    responseStatus(res, 200, "success", result);
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

/**
 * @description Get question by ID
 * @route GET /api/v1/questions/:id
 * @access Private
 **/
exports.getQuestionByIdController = async (req, res) => {
  try {
    const result = await getQuestionsByIdService(req.params.id);
    responseStatus(res, 200, "success", result);
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

/**
 * @description Update Question
 * @route PATCH /api/v1/questions/:id
 * @access Private Instructor only
 **/
exports.updateQuestionController = async (req, res) => {
  try {
    await updateQuestionsService(req.body, req.params.id, res);
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

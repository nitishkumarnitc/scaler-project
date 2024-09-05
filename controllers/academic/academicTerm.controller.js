const responseStatus = require("../../handlers/responseStatus.handler");
const {
  createAcademicTermService,
} = require("../../services/academic/academicTerm.service");

/**
 * @desc Create Academic Term
 * @route POST /api/v1/academic-Terms
 * @access Private
 **/
exports.createAcademicTermController = async (req, res) => {
  try {
    createAcademicTermService(req.body, req.userAuth.id, res);
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

/**
 * @desc Get all Academic Terms
 * @route GET /api/v1/academic-Terms
 * @access Private
 **/
exports.getAcademicTermsController = async (req, res) => {
  try {
    const result = await getAcademicTermsService();
    responseStatus(res, 201, "success", result);
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

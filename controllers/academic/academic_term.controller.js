const responseStatus = require("../../handlers/response_status.handler");
const {
  createAcademicTermService,
  getAcademicTermsService,
  getAcademicTermService,
  updateAcademicTermService,
  deleteAcademicTermService,
} = require("../../services/academic/academic_term.service");

/**
 * @description Create Academic Term
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
 * @description Get all Academic Terms
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

/**
 * @description Get single Academic Term
 * @route GET /api/v1/academic-Terms/:id
 * @access Private
 **/
exports.getAcademicTermController = async (req, res) => {
  try {
    const result = await getAcademicTermService(req.params.id);
    responseStatus(res, 201, "success", result);
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

/**
 * @description Update Academic Term
 * @route Patch /api/v1/academic-Terms/:id
 * @access Private
 **/
exports.updateAcademicTermController = async (req, res) => {
  try {
    const { body, params, userAuth } = req;
    await updateAcademicTermService(body, params.id, userAuth.id, res);
  } catch (error) {
    responseStatus(res, 400, "error", error.message);
  }
};

/**
 * @description Delete Academic Term
 * @route Delete /api/v1/academic-Terms/:id
 * @access Private
 **/
exports.deleteAcademicTermController = async (req, res) => {
  try {
    const result = await deleteAcademicTermService(req.params.id);
    responseStatus(res, 201, "success", result);
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

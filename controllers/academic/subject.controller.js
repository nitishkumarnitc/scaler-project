const responseStatus = require("../../handlers/response_status.handler");
const {
  createSubjectService,
  getAllSubjectsService,
  getSubjectsService,
  deleteSubjectService,
  updateSubjectService,
} = require("../../services/academic/subject.service");

/**
 * @description Create Subject
 * @route POST /api/v1/create-subject/:programId
 * @access Private
 **/
exports.createSubjectController = async (req, res) => {
  try {
    await createSubjectService(
      req.body,
      req.params.programId,
      req.userAuth.id,
      res
    );
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

/**
 * @description Get all Subjects
 * @route GET /api/v1/subject
 * @access Private
 **/
exports.getSubjectsController = async (req, res) => {
  try {
    const result = await getAllSubjectsService();
    responseStatus(res, 200, "success", result);
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

/**
 * @description Get single Subject
 * @route GET /api/v1/subject/:id
 * @access Private
 **/
exports.getSubjectController = async (req, res) => {
  try {
    const result = await getSubjectsService(req.params.id);
    responseStatus(res, 200, "success", result);
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

/**
 * @description Update Subject
 * @route Patch /api/v1/subject/:id
 * @access Private
 **/
exports.updateSubjectController = async (req, res) => {
  try {
    await updateSubjectService(req.body, req.params.id, req.userAuth.id, res);
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

/**
 * @description Delete Subject
 * @route Delete /api/v1/subject/:id
 * @access Private
 **/
exports.deleteSubjectController = async (req, res) => {
  try {
    const result = await deleteSubjectService(req.params.id);
    responseStatus(res, 200, "success", result);
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

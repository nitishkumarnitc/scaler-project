const responseStatus = require("../../handlers/response_status.handler");
const {
  createProgramService,
  getAllProgramsService,
  getProgramsService,
  updateProgramService,
  deleteProgramService,
} = require("../../services/academic/program.service");

/**
 * @description Create Program
 * @route POST /api/v1/programs
 * @access Private
 **/
exports.createProgramController = async (req, res) => {
  try {
    await createProgramService(req.body, req.userAuth.id, res);
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

/**
 * @description Get all programs
 * @route GET /api/v1/programs
 * @access Private
 **/
exports.getProgramsController = async (req, res) => {
  try {
    const result = await getAllProgramsService();
    responseStatus(res, 200, "success", result);
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

/**
 * @description Get single Program
 * @route GET /api/v1/programs/:id
 * @access Private
 **/
exports.getProgramController = async (req, res) => {
  try {
    const result = await getProgramsService(req.params.id);
    responseStatus(res, 200, "success", result);
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

/**
 * @description Update Program
 * @route Patch /api/v1/programs/:id
 * @access Private
 **/
exports.updateProgramController = async (req, res) => {
  try {
    await updateProgramService(req.body, req.params.id, req.userAuth.id, res);
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

/**
 * @description Delete Program
 * @route Delete /api/v1/programs/:id
 * @access Private
 **/
exports.deleteProgramController = async (req, res) => {
  try {
    const result = await deleteProgramService(req.params.id);
    responseStatus(res, 200, "success", result);
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

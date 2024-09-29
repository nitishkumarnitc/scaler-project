const responseStatus = require("../../handlers/response_status.handler");
const {
  createClassLevelService,
  getAllClassesService,
  getClassLevelsService,
  deleteClassLevelService,
  updateClassLevelService,
} = require("../../services/academic/class.service");

/**
 * @description Create Class Level
 * @route POST /api/v1/class-levels
 * @access Private
 **/
exports.createClassLevelController = async (req, res) => {
  try {
    await createClassLevelService(req.body, req.userAuth.id, res);
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

/**
 * @description Get all Class Levels
 * @route GET /api/v1/class-levels
 * @access Private
 **/
exports.getClassLevelsController = async (req, res) => {
  try {
    const result = await getAllClassesService();
    responseStatus(res, 200, "success", result);
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

/**
 * @description Get single Class Level
 * @route GET /api/v1/class-levels/:id
 * @access Private
 **/
exports.getClassLevelController = async (req, res) => {
  try {
    const result = await getClassLevelsService(req.params.id);
    responseStatus(res, 200, "success", result);
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

/**
 * @description Update Class Level
 * @route Patch /api/v1/class-levels/:id
 * @access Private
 **/
exports.updateClassLevelController = async (req, res) => {
  try {
    const { body, params, userAuth } = req;
    await updateClassLevelService(body, params.id, userAuth.id, res);
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

/**
 * @description Delete Class Level
 * @route Delete /api/v1/class-levels/:id
 * @access Private
 **/
exports.deleteClassLevelController = async (req, res) => {
  try {
    const result = await deleteClassLevelService(req.params.id);
    responseStatus(res, 200, "success", result);
  } catch (error) {
    responseStatus(res, 400, "failed", error.message);
  }
};

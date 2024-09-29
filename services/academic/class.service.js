// services/class.service.js
const {
  ClassLevel,
  getAllClasses,
  createClassLevel,
  updateClassLevel,
  deleteClassLevel
} = require("../../models/Academic/class.model");
const Admin = require("../../models/Staff/admin.model");
const responseStatus = require("../../handlers/response_status.handler");

/**
 * Create class service.
 *
 * @param {Object} data - The data containing information about the class.
 * @param {string} userId - The ID of the user creating the class.
 * @returns {Object} - The response object indicating success or failure.
 */
exports.createClassLevelService = async (data, userId) => {
  try {
    const classCreated = await createClassLevel(data, userId);

    // Push the class into the admin's classLevels array
    const admin = await Admin.findById(userId);
    admin.classLevels.push(classCreated._id);
    // Save the changes
    await admin.save();

    // Send the response
    return responseStatus(res, 200, "success", classCreated);
  } catch (error) {
    return responseStatus(res, 400, "failed", error.message);
  }
};

/**
 * Get all classes service.
 *
 * @returns {Array} - An array of all classes.
 */
exports.getAllClassesService = async () => {
  return await getAllClasses();
};

/**
 * Get a single class by ID service.
 *
 * @param {string} id - The ID of the class.
 * @returns {Object} - The class object.
 */
exports.getClassLevelsService = async (id) => {
  return await ClassLevel.findById(id);
};

/**
 * Update class data service.
 *
 * @param {Object} data - Contains the new data for the class.
 * @param {string} id - The ID of the class that needs updating.
 * @param {string} userId - The ID of the user performing the update.
 * @returns {Object} - Result object indicating whether the update was successful or not.
 */
exports.updateClassLevelService = async (data, id, userId) => {
  try {
    const classLevel = await updateClassLevel(id, data, userId);
    return responseStatus(res, 200, "success", classLevel);
  } catch (error) {
    return responseStatus(res, 400, "failed", error.message);
  }
};

/**
 * Delete class data service.
 *
 * @param {string} id - The ID of the class to be deleted.
 * @returns {Object} - The deleted class object.
 */
exports.deleteClassLevelService = async (id) => {
  return await deleteClassLevel(id);
};

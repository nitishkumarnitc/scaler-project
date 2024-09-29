// Import necessary models and services
const {
  AcademicYear,
  getAllAcademicYears,
  createAcademicYear,
  updateAcademicYear,
  deleteAcademicYear
} = require("../../models/Academic/academic_year.model");
const Admin = require("../../models/Staff/admin.model");
const responseStatus = require("../../handlers/response_status.handler");

/**
 * Create academic years service.
 *
 * @param {Object} data - The data containing information about the academic year.
 * @param {string} userId - The ID of the user creating the academic year.
 * @returns {Object} - The response object indicating success or failure.
 */
exports.createAcademicYearService = async (data, userId) => {
  try {
    const academicYearCreated = await createAcademicYear(data, userId);

    // Push the academic year into the admin's academicYears array
    const admin = await Admin.findById(userId);
    admin.academicYears.push(academicYearCreated._id);
    await admin.save();

    // Send the response
    return responseStatus(res, 201, "success", academicYearCreated);
  } catch (error) {
    return responseStatus(res, 402, "failed", error.message);
  }
};

/**
 * Get all academic years service.
 *
 * @returns {Array} - An array of all academic years.
 */
exports.getAcademicYearsService = async () => {
  return await getAllAcademicYears();
};

/**
 * Get academic year by ID service.
 *
 * @param {string} id - The ID of the academic year.
 * @returns {Object} - The academic year object.
 */
exports.getAcademicYearService = async (id) => {
  return await AcademicYear.findById(id);
};

/**
 * Update academic year service.
 *
 * @param {Object} data - The data containing updated information about the academic year.
 * @param {string} academicId - The ID of the academic year to be updated.
 * @param {string} userId - The ID of the user updating the academic year.
 * @returns {Object} - The response object indicating success or failure.
 */
exports.updateAcademicYearService = async (data, academicId, userId) => {
  try {
    const academicYear = await updateAcademicYear(academicId, data, userId);
    return responseStatus(res, 201, "success", academicYear);
  } catch (error) {
    return responseStatus(res, 402, "failed", error.message);
  }
};

/**
 * Delete academic year service.
 *
 * @param {string} id - The ID of the academic year to be deleted.
 * @returns {Object} - The deleted academic year object.
 */
exports.deleteAcademicYearService = async (id) => {
  return await deleteAcademicYear(id);
};

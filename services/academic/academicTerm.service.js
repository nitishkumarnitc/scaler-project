// Import necessary models
const AcademicTerm = require("../../models/Academic/academicTerm.model");

// Import responseStatus handler
const responseStatus = require("../../handlers/responseStatus.handler");

/**
 * Create academic terms service.
 *
 * @param {Object} data - The data containing information about the academic term.
 * @param {string} data.name - The name of the academic term.
 * @param {string} data.description - The description of the academic term.
 * @param {string} data.duration - The duration of the academic term.
 * @param {string} userId - The ID of the user creating the academic term.
 * @returns {Object} - The response object indicating success or failure.
 */
exports.createAcademicTermService = async (data, userId) => {
  const { name, description, duration } = data;

  // Check if the academic term already exists
  const academicTerm = await AcademicTerm.findOne({ name });
  if (academicTerm) {
    return responseStatus(res, 402, "failed", "Academic term already exists");
  }

  // Create the academic term
  const academicTermCreated = await AcademicTerm.create({
    name,
    description,
    duration,
    createdBy: userId,
  });



  // Send the response
  return responseStatus(res, 200, "success", academicTermCreated);
};

// Import necessary models
const AcademicTerm = require("../../models/Academic/academic_term.model");
const Admin = require("../../models/Staff/admin.model");
// Import responseStatus handler
const responseStatus = require("../../handlers/response_status.handler");
const redisClient = require("../../config/redis_connect"); // Import Redis client

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

  // Push the academic term into the admin's academicTerms array
  const admin = await Admin.findById(userId);
  admin.academicTerms.push(academicTermCreated._id);
  await admin.save();

  // Clear the cache (optional: you may choose to only clear specific cache)
  await redisClient.del("academic_terms_cache");

  // Send the response
  return responseStatus(res, 200, "success", academicTermCreated);
};

/**
 * Get all academic terms service.
 *
 * @returns {Array} - An array of all academic terms.
 */
exports.getAcademicTermsService = async () => {
  const cacheKey = "academic_terms_cache"; // Unique key for Redis

  // Try to fetch the result from Redis cache
  const cachedResult = await redisClient.get(cacheKey);

  if (cachedResult) {
    console.log('Serving from cache');
    return JSON.parse(cachedResult); // Parse the cached data
  }

  // If not in cache, query the database
  const academicTerms = await AcademicTerm.find();

  // Store the result in Redis for future queries
  await redisClient.setEx(cacheKey, 3600, JSON.stringify(academicTerms)); // Cache for 1 hour

  return academicTerms;
};

/**
 * Get academic term by ID service.
 *
 * @param {string} id - The ID of the academic term.
 * @returns {Object} - The academic term object.
 */
exports.getAcademicTermService = async (id) => {
  return await AcademicTerm.findById(id);
};

/**
 * Update academic term service.
 *
 * @param {Object} data - The data containing updated information about the academic term.
 * @param {string} data.name - The updated name of the academic term.
 * @param {string} data.description - The updated description of the academic term.
 * @param {string} data.duration - The updated duration of the academic term.
 * @param {string} academicId - The ID of the academic term to be updated.
 * @param {string} userId - The ID of the user updating the academic term.
 * @returns {Object} - The response object indicating success or failure.
 */
exports.updateAcademicTermService = async (data, academicId, userId) => {
  const { name, description, duration } = data;

  // Check if the updated name already exists
  const createAcademicTermFound = await AcademicTerm.findOne({ name });
  if (createAcademicTermFound) {
    return responseStatus(res, 402, "failed", "Academic term already exists");
  }

  // Update the academic term
  const academicTerm = await AcademicTerm.findByIdAndUpdate(
      academicId,
      { name, description, duration, createdBy: userId },
      { new: true }
  );

  // Clear the cache (optional)
  await redisClient.del("academic_terms_cache");

  // Send the response
  return responseStatus(res, 201, "success", academicTerm);
};

/**
 * Delete academic term service.
 *
 * @param {string} id - The ID of the academic term to be deleted.
 * @returns {Object} - The deleted academic term object.
 */
exports.deleteAcademicTermService = async (id) => {
  // Clear the cache before deletion
  await redisClient.del("academic_terms_cache");
  return await AcademicTerm.findByIdAndDelete(id);
};

// Import necessary models
const YearGroup = require("../../models/Academic/year_group.model");
const Admin = require("../../models/Staff/admin.model");
// Import responseStatus handler
const responseStatus = require("../../handlers/response_status.handler");
// Import Redis client for caching
const redisClient = require("../../config/redis_connect");

/**
 * Service to create a Year Group.
 *
 * @param {Object} data - Contains information about the Year Group.
 * @param {string} data.name - The name of the Year Group.
 * @param {string} data.academicYear - The academic year associated with the Year Group.
 * @param {string} userId - The ID of the user creating the Year Group.
 * @returns {Object} - The response object indicating success or failure.
 */
exports.createYearGroupService = async (data, userId, res) => {
  const { name, academicYear } = data;

  // Check if the Year Group already exists
  const existingYearGroup = await YearGroup.findOne({ name });
  if (existingYearGroup) {
    return responseStatus(res, 409, "failed", "Year Group already exists");
  }

  // Create the Year Group
  const newYearGroup = await YearGroup.create({
    name,
    academicYear,
    createdBy: userId,
  });

  // Associate the Year Group with the Admin
  const admin = await Admin.findById(userId);
  if (!admin) {
    return responseStatus(res, 404, "failed", "Admin does not exist");
  }
  admin.yearGroups.push(newYearGroup._id);
  await admin.save();

  // Invalidate the cache
  await redisClient.del("yearGroups");

  // Send the response
  return responseStatus(res, 201, "success", newYearGroup);
};

/**
 * Service to retrieve all Year Groups.
 *
 * @param {Object} res - The response object.
 * @returns {Array} - An array of all Year Groups.
 */
exports.getAllYearGroupsService = async (res) => {
  const cacheKey = "yearGroups";

  // Check the cache for Year Groups
  const cachedYearGroups = await redisClient.get(cacheKey);
  if (cachedYearGroups) {
    return responseStatus(res, 200, "success", JSON.parse(cachedYearGroups));
  }

  // Retrieve from the database if not cached
  const yearGroups = await YearGroup.find();
  await redisClient.set(cacheKey, JSON.stringify(yearGroups)); // Cache the result

  return responseStatus(res, 200, "success", yearGroups);
};

/**
 * Service to get a Year Group by ID.
 *
 * @param {string} id - The ID of the Year Group.
 * @param {Object} res - The response object.
 * @returns {Object} - The Year Group object.
 */
exports.getYearGroupByIdService = async (id, res) => {
  const cacheKey = `yearGroup:${id}`;

  // Check the cache first
  const cachedYearGroup = await redisClient.get(cacheKey);
  if (cachedYearGroup) {
    return responseStatus(res, 200, "success", JSON.parse(cachedYearGroup));
  }

  // Retrieve from the database if not cached
  const yearGroup = await YearGroup.findById(id);
  if (!yearGroup) {
    return responseStatus(res, 404, "failed", "Year Group not found");
  }

  // Cache the result
  await redisClient.set(cacheKey, JSON.stringify(yearGroup));
  return responseStatus(res, 200, "success", yearGroup);
};

/**
 * Service to update a Year Group.
 *
 * @param {Object} data - The updated information about the Year Group.
 * @param {string} data.name - The updated name of the Year Group.
 * @param {string} data.academicYear - The updated academic year associated with the Year Group.
 * @param {string} id - The ID of the Year Group to update.
 * @param {string} userId - The ID of the user updating the Year Group.
 * @returns {Object} - The response object indicating success or failure.
 */
exports.updateYearGroupService = async (data, id, userId, res) => {
  const { name, academicYear } = data;

  // Check if the updated name already exists
  const existingGroup = await YearGroup.findOne({ name });
  if (existingGroup) {
    return responseStatus(res, 409, "failed", "Year Group already exists");
  }

  // Update the Year Group
  const updatedYearGroup = await YearGroup.findByIdAndUpdate(
      id,
      {
        name,
        academicYear,
        createdBy: userId,
      },
      { new: true }
  );

  if (!updatedYearGroup) {
    return responseStatus(res, 404, "failed", "Year Group not found");
  }

  // Invalidate the cache
  await redisClient.del("yearGroups");
  await redisClient.del(`yearGroup:${id}`);

  return responseStatus(res, 200, "success", updatedYearGroup);
};

/**
 * Service to delete a Year Group.
 *
 * @param {string} id - The ID of the Year Group to delete.
 * @param {Object} res - The response object.
 * @returns {Object} - The deleted Year Group object or a response indicating failure.
 */
exports.deleteYearGroupService = async (id, res) => {
  const deletedGroup = await YearGroup.findByIdAndDelete(id);
  if (!deletedGroup) {
    return responseStatus(res, 404, "failed", "Year Group not found");
  }

  // Invalidate the cache
  await redisClient.del("yearGroups");
  await redisClient.del(`yearGroup:${id}`);

  return responseStatus(res, 200, "success", deletedGroup);
};

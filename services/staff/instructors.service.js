// Import necessary modules
const {
  hashPassword,
  isPassMatched,
} = require("../../handlers/pass_hash.handler");
const responseStatus = require("../../handlers/response_status.handler");
const Instructor = require("../../models/Staff/instructors.model");
const Admin = require("../../models/Staff/admin.model");
const generateToken = require("../../utils/token_generator");
const redisClient = require("../../config/redis_connect"); // Assuming you have a Redis client set up

/**
 * Register instructor service.
 *
 * @param {Object} data - The data containing information about the instructor.
 * @param {string} data.name - The name of the instructor.
 * @param {string} data.email - The email of the instructor.
 * @param {string} data.password - The password of the instructor.
 * @param {string} adminId - The ID of the admin creating the instructor.
 * @returns {void} - The created instructor object or an error message.
 */
exports.registerInstructorService = async (data, adminId, res) => {
  const { name, email, password } = data;

  // Check if instructor with the same email already exists
  const isInstructorExist = await Instructor.findOne({ email });

  if (isInstructorExist) {
    return responseStatus(res, 401, "failed", "Email Already in use");
  } else {
    // Create a new instructor
    const hashedPassword = await hashPassword(password);
    const newInstructor = await Instructor.create({
      name,
      email,
      password: hashedPassword,
      createdBy: adminId, // Associate with the admin
    });

    // Invalidate the cache
    await redisClient.del("instructors");
    return responseStatus(res, 201, "success", newInstructor);
  }
};

/**
 * Login instructor service.
 *
 * @param {Object} data - The data containing login information.
 * @param {string} data.email - The email of the instructor.
 * @param {string} data.password - The password of the instructor.
 * @returns {Object} - The instructor user, token, and verification status or an error message.
 */
exports.loginInstructorService = async (data, res) => {
  const { email, password } = data;

  // Find the instructor user by email
  const user = await Instructor.findOne({ email });
  if (!user)
    return responseStatus(res, 405, "failed", "Invalid login credentials");

  // Check if the provided password is valid
  const isPassValid = await isPassMatched(password, user.password);

  if (isPassValid) {
    // Generate a token and verify it
    const token = generateToken(user._id);
    const result = {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
      token,
    };
    // Return user, token, and verification status
    return responseStatus(res, 200, "success", result);
  } else {
    return responseStatus(res, 405, "failed", "Invalid login credentials");
  }
};

/**
 * Get all instructors service.
 *
 * @returns {Array} - An array of all instructor users.
 */
exports.getInstructorsService = async (res) => {
  const cacheKey = "instructors";

  // Check the cache for instructors
  const cachedInstructors = await redisClient.get(cacheKey);
  if (cachedInstructors) {
    return responseStatus(res, 200, "success", JSON.parse(cachedInstructors));
  }

  // Retrieve from the database if not cached
  const instructors = await Instructor.find({}).select("-password -createdAt -updatedAt");

  // Cache the result
  await redisClient.set(cacheKey, JSON.stringify(instructors), "EX", 3600); // Cache for 1 hour

  return responseStatus(res, 200, "success", instructors);
};

/**
 * Get single instructor profile service.
 *
 * @param {string} id - The ID of the instructor user.
 * @returns {Object} - The instructor user profile or an error message.
 */
exports.getSingleInstructorProfileService = async (id, res) => {
  const cacheKey = `instructor:${id}`;

  // Check the cache first
  const cachedUser = await redisClient.get(cacheKey);
  if (cachedUser) {
    return responseStatus(res, 200, "success", JSON.parse(cachedUser));
  }

  const user = await Instructor.findOne({ _id: id })
      .select("-password -createdAt -updatedAt");

  if (!user) {
    return responseStatus(res, 201, "failed", "Instructor doesn't exist");
  } else {
    // Cache the result
    await redisClient.set(cacheKey, JSON.stringify(user), "EX", 3600); // Cache for 1 hour
    return responseStatus(res, 201, "success", user);
  }
};

/**
 * Update single instructor service.
 *
 * @param {string} id - The ID of the instructor user to be updated.
 * @param {Object} data - The data containing updated information about the instructor.
 * @param {string} data.email - The updated email of the instructor.
 * @param {string} data.name - The updated name of the instructor.
 * @param {string} data.password - The updated password of the instructor.
 * @returns {Object} - The updated instructor object or an error message.
 */
exports.updateInstructorService = async (id, data, res) => {
  const { email, name, password } = data;

  // Check if the updated email already exists
  const emailTaken = await Instructor.findOne({ email });
  if (emailTaken) {
    return responseStatus(res, 401, "failed", "Email is already in use");
  }

  let updateResult;
  if (password) {
    // If password is provided, update it
    updateResult = await Instructor.findByIdAndUpdate(
        id,
        { name, email, password: await hashPassword(password) },
        { new: true }
    ).select("-password -createdAt -updatedAt");
  } else {
    // If no password provided, update only email and name
    updateResult = await Instructor.findByIdAndUpdate(
        id,
        { email, name },
        { new: true }
    ).select("-password -createdAt -updatedAt");
  }

  if (!updateResult) {
    return responseStatus(res, 404, "failed", "Instructor not found");
  }

  // Invalidate the cache for the updated instructor
  await redisClient.del(`instructor:${id}`);
  await redisClient.del("instructors"); // Optional: Clear all instructors cache

  return responseStatus(res, 201, "success", updateResult);
};

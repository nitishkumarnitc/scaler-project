// Import necessary modules
const {
  hashPassword,
  isPassMatched,
} = require("../../handlers/pass_hash.handler");
const responseStatus = require("../../handlers/response_status.handler");
const Admin = require("../../models/Staff/admin.model");
const generateToken = require("../../utils/token_generator");
const redisClient = require("../../config/redis_connect"); // Assuming you have a Redis client set up

/**
 * Register admin service.
 *
 * @param {Object} data - The data containing information about the admin.
 * @param {string} data.name - The name of the admin.
 * @param {string} data.email - The email of the admin.
 * @param {string} data.password - The password of the admin.
 * @returns {void} - The created admin object or an error message.
 */
exports.registerAdminService = async (data, res) => {
  const { name, email, password } = data;

  // Check if admin with the same email already exists
  const isAdminExist = await Admin.findOne({ email });

  if (isAdminExist) {
    return responseStatus(res, 401, "failed", "Email Already in use");
  } else {
    // Create a new admin
    await Admin.create({
      name,
      email,
      password: await hashPassword(password),
    });
    // Invalidate the cache
    await redisClient.del("admins");
    return responseStatus(res, 201, "success", "Registration Successful!");
  }
};

/**
 * Login admin service.
 *
 * @param {Object} data - The data containing login information.
 * @param {string} data.email - The email of the admin.
 * @param {string} data.password - The password of the admin.
 * @returns {Object} - The admin user, token, and verification status or an error message.
 */
exports.loginAdminService = async (data, res) => {
  const { email, password } = data;

  // Find the admin user by email
  const user = await Admin.findOne({ email });
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
        role: user.role,
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
 * Get all admins service.
 *
 * @returns {Array} - An array of all admin users.
 */
exports.getAdminsService = async (res) => {
  const cacheKey = "admins";

  // Check the cache for admins
  const cachedAdmins = await redisClient.get(cacheKey);
  if (cachedAdmins) {
    return responseStatus(res, 200, "success", JSON.parse(cachedAdmins));
  }

  // Retrieve from the database if not cached
  const admins = await Admin.find({}).select("-password -createdAt -updatedAt");

  // Cache the result
  await redisClient.set(cacheKey, JSON.stringify(admins), "EX", 3600); // Cache for 1 hour

  return responseStatus(res, 200, "success", admins);
};

/**
 * Get single admin profile service.
 *
 * @param {string} id - The ID of the admin user.
 * @returns {Object} - The admin user profile or an error message.
 */
exports.getSingleProfileService = async (id, res) => {
  const cacheKey = `admin:${id}`;

  // Check the cache first
  const cachedUser = await redisClient.get(cacheKey);
  if (cachedUser) {
    return responseStatus(res, 200, "success", JSON.parse(cachedUser));
  }

  const user = await Admin.findOne({ _id: id })
      .select("-password -createdAt -updatedAt")
      .populate("academicTerms")
      .populate("programs")
      .populate("academicYears")
      .populate("yearGroups")
      .populate("instructors")
      .populate("classLevel")
      .populate("students");

  if (!user) {
    return responseStatus(res, 201, "failed", "Admin doesn't exist ");
  } else {
    // Cache the result
    await redisClient.set(cacheKey, JSON.stringify(user), "EX", 3600); // Cache for 1 hour
    return responseStatus(res, 201, "success", user);
  }
};

/**
 * Update single admin service.
 *
 * @param {string} id - The ID of the admin user to be updated.
 * @param {Object} data - The data containing updated information about the admin.
 * @param {string} data.email - The updated email of the admin.
 * @param {string} data.name - The updated name of the admin.
 * @param {string} data.password - The updated password of the admin.
 * @returns {Object} - The updated admin object or an error message.
 */
exports.updateAdminService = async (id, data, res) => {
  const { email, name, password } = data;

  // Check if the updated email already exists
  const emailTaken = await Admin.findOne({ email });
  if (emailTaken) {
    return responseStatus(res, 401, "failed", "Email is already in use");
  }

  let updateResult;
  if (password) {
    // If password is provided, update it
    updateResult = await Admin.findByIdAndUpdate(
        id,
        { name, email, password: await hashPassword(password) },
        { new: true }
    ).select("-password -createdAt -updatedAt");
  } else {
    // If no password provided, update only email and name
    updateResult = await Admin.findByIdAndUpdate(
        id,
        { email, name },
        { new: true }
    ).select("-password -createdAt -updatedAt");
  }

  if (!updateResult) {
    return responseStatus(res, 404, "failed", "Admin not found");
  }

  // Invalidate the cache for the updated admin
  await redisClient.del(`admin:${id}`);
  await redisClient.del("admins"); // Optional: Clear all admins cache

  return responseStatus(res, 201, "success", updateResult);
};

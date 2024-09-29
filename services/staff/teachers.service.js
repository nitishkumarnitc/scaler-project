// Import necessary modules
const {
  hashPassword,
  isPassMatched,
} = require("../../handlers/pass_hash.handler");
const responseStatus = require("../../handlers/response_status.handler");
const Teacher = require("../../models/Staff/teachers.model");
const Admin = require("../../models/Staff/admin.model");
const generateToken = require("../../utils/token_generator");
const redisClient = require("../../config/redis_connect"); // Assuming you have a Redis client set up

/**
 * Register teacher service.
 *
 * @param {Object} data - The data containing information about the teacher.
 * @param {string} data.name - The name of the teacher.
 * @param {string} data.email - The email of the teacher.
 * @param {string} data.password - The password of the teacher.
 * @param {string} adminId - The ID of the admin creating the teacher.
 * @returns {void} - The created teacher object or an error message.
 */
exports.registerTeacherService = async (data, adminId, res) => {
  const { name, email, password } = data;

  // Check if teacher with the same email already exists
  const isTeacherExist = await Teacher.findOne({ email });

  if (isTeacherExist) {
    return responseStatus(res, 401, "failed", "Email Already in use");
  } else {
    // Create a new teacher
    const hashedPassword = await hashPassword(password);
    const newTeacher = await Teacher.create({
      name,
      email,
      password: hashedPassword,
      createdBy: adminId, // Associate with the admin
    });

    // Invalidate the cache
    await redisClient.del("teachers");
    return responseStatus(res, 201, "success", newTeacher);
  }
};

/**
 * Login teacher service.
 *
 * @param {Object} data - The data containing login information.
 * @param {string} data.email - The email of the teacher.
 * @param {string} data.password - The password of the teacher.
 * @returns {Object} - The teacher user, token, and verification status or an error message.
 */
exports.loginTeacherService = async (data, res) => {
  const { email, password } = data;

  // Find the teacher user by email
  const user = await Teacher.findOne({ email });
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
 * Get all teachers service.
 *
 * @returns {Array} - An array of all teacher users.
 */
exports.getTeachersService = async (res) => {
  const cacheKey = "teachers";

  // Check the cache for teachers
  const cachedTeachers = await redisClient.get(cacheKey);
  if (cachedTeachers) {
    return responseStatus(res, 200, "success", JSON.parse(cachedTeachers));
  }

  // Retrieve from the database if not cached
  const teachers = await Teacher.find({}).select("-password -createdAt -updatedAt");

  // Cache the result
  await redisClient.set(cacheKey, JSON.stringify(teachers), "EX", 3600); // Cache for 1 hour

  return responseStatus(res, 200, "success", teachers);
};

/**
 * Get single teacher profile service.
 *
 * @param {string} id - The ID of the teacher user.
 * @returns {Object} - The teacher user profile or an error message.
 */
exports.getSingleTeacherProfileService = async (id, res) => {
  const cacheKey = `teacher:${id}`;

  // Check the cache first
  const cachedUser = await redisClient.get(cacheKey);
  if (cachedUser) {
    return responseStatus(res, 200, "success", JSON.parse(cachedUser));
  }

  const user = await Teacher.findOne({ _id: id })
      .select("-password -createdAt -updatedAt");

  if (!user) {
    return responseStatus(res, 201, "failed", "Teacher doesn't exist");
  } else {
    // Cache the result
    await redisClient.set(cacheKey, JSON.stringify(user), "EX", 3600); // Cache for 1 hour
    return responseStatus(res, 201, "success", user);
  }
};

/**
 * Update single teacher service.
 *
 * @param {string} id - The ID of the teacher user to be updated.
 * @param {Object} data - The data containing updated information about the teacher.
 * @param {string} data.email - The updated email of the teacher.
 * @param {string} data.name - The updated name of the teacher.
 * @param {string} data.password - The updated password of the teacher.
 * @returns {Object} - The updated teacher object or an error message.
 */
exports.updateTeacherService = async (id, data, res) => {
  const { email, name, password } = data;

  // Check if the updated email already exists
  const emailTaken = await Teacher.findOne({ email });
  if (emailTaken) {
    return responseStatus(res, 401, "failed", "Email is already in use");
  }

  let updateResult;
  if (password) {
    // If password is provided, update it
    updateResult = await Teacher.findByIdAndUpdate(
        id,
        { name, email, password: await hashPassword(password) },
        { new: true }
    ).select("-password -createdAt -updatedAt");
  } else {
    // If no password provided, update only email and name
    updateResult = await Teacher.findByIdAndUpdate(
        id,
        { email, name },
        { new: true }
    ).select("-password -createdAt -updatedAt");
  }

  if (!updateResult) {
    return responseStatus(res, 404, "failed", "Teacher not found");
  }

  // Invalidate the cache for the updated teacher
  await redisClient.del(`teacher:${id}`);
  await redisClient.del("teachers"); // Optional: Clear all teachers cache

  return responseStatus(res, 201, "success", updateResult);
};

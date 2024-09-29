const {
  hashPassword,
  isPassMatched,
} = require("../../handlers/pass_hash.handler");
const Admin = require("../../models/Staff/admin.model");
const Learner = require("../../models/Learners/learners.model");
const Exam = require("../../models/Academic/exams.model");
const Results = require("../../models/Academic/results.model");
const generateToken = require("../../utils/token_generator");
const responseStatus = require("../../handlers/response_status.handler");
const { resultCalculate } = require("../../functions/result_calculate.function");
const redisClient = require("../../config/redis_connect"); // Assuming you have a Redis client set up

/**
 * Admin registration service for creating a new learner.
 *
 * @param {Object} data - The data containing information about the new learner.
 * @param {string} data.name - The name of the learner.
 * @param {string} data.email - The email of the learner.
 * @param {string} data.password - The password of the learner.
 * @param {Object} res - The Express response object.
 * @returns {Object} - The response object indicating success or failure.
 */
exports.adminRegisterLearnerService = async (data, adminId, res) => {
  const { name, email, password } = data;

  // Finding admin
  const admin = await Admin.findById(adminId);
  if (!admin) {
    return responseStatus(res, 405, "failed", "Unauthorized access!");
  }

  // Check if learner already exists
  const learner = await Learner.findOne({ email });
  if (learner) {
    return responseStatus(res, 402, "failed", "Learner already enrolled");
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Create learner
  const studentRegistered = await Learner.create({
    name,
    email,
    password: hashedPassword,
  });

  // Saving to admin
  admin.learners.push(studentRegistered._id);
  await admin.save();

  return responseStatus(res, 200, "success", studentRegistered);
};

/**
 * Learner login service.
 *
 * @param {Object} data - The data containing information about the login.
 * @param {string} data.email - The email of the learner.
 * @param {string} data.password - The password of the learner.
 * @param {Object} res - The Express response object.
 * @returns {Object} - The response object indicating success or failure.
 */
exports.studentLoginService = async (data, res) => {
  const { email, password } = data;

  // Find the user
  const learner = await Learner.findOne({ email }).select("-password ");
  if (!learner) {
    return responseStatus(res, 402, "failed", "Invalid login credentials");
  }

  // Verify the password
  const isMatched = await isPassMatched(password, learner?.password);
  if (!isMatched) {
    return responseStatus(res, 401, "failed", "Invalid login credentials");
  }

  const responseData = { learner, token: generateToken(learner._id) };
  return responseStatus(res, 200, "success", responseData);
};

/**
 * Get learner profile service.
 *
 * @param {string} id - The ID of the learner.
 * @param {Object} res - The Express response object.
 * @returns {Object} - The response object indicating success or failure.
 */
exports.getLearnersProfileService = async (id, res) => {
  const cacheKey = `learner:${id}`;

  // Check the cache first
  const cachedLearner = await redisClient.get(cacheKey);
  if (cachedLearner) {
    return responseStatus(res, 200, "success", JSON.parse(cachedLearner));
  }

  const learner = await Learner.findById(id).select(
      "-password -createdAt -updatedAt"
  );

  if (!learner) {
    return responseStatus(res, 402, "failed", "Learner not found");
  }

  // Cache the result
  await redisClient.set(cacheKey, JSON.stringify(learner), "EX", 3600); // Cache for 1 hour
  return responseStatus(res, 200, "success", learner);
};

/**
 * Get all learners service (for admin use).
 *
 * @param {Object} res - The Express response object.
 * @returns {Array} - An array of all learners.
 */
exports.getAllLearnersByAdminService = async (res) => {
  const cacheKey = "learners";

  // Check the cache for learners
  const cachedLearners = await redisClient.get(cacheKey);
  if (cachedLearners) {
    return responseStatus(res, 200, "success", JSON.parse(cachedLearners));
  }

  // Retrieve from the database if not cached
  const learners = await Learner.find({}).select("-password -createdAt -updatedAt");

  // Cache the result
  await redisClient.set(cacheKey, JSON.stringify(learners), "EX", 3600); // Cache for 1 hour

  return responseStatus(res, 200, "success", learners);
};

/**
 * Get a single learner by admin.
 *
 * @param {string} studentID - The ID of the learner.
 * @param {Object} res - The Express response object.
 * @returns {Object} - The response object indicating success or failure.
 */
exports.getLearnerByAdminService = async (studentID, res) => {
  const cacheKey = `learner:${studentID}`;

  // Check the cache first
  const cachedLearner = await redisClient.get(cacheKey);
  if (cachedLearner) {
    return responseStatus(res, 200, "success", JSON.parse(cachedLearner));
  }

  const learner = await Learner.findById(studentID);
  if (!learner) {
    return responseStatus(res, 402, "failed", "Learner not found");
  }

  // Cache the result
  await redisClient.set(cacheKey, JSON.stringify(learner), "EX", 3600); // Cache for 1 hour
  return responseStatus(res, 200, "success", learner);
};

/**
 * Learner update profile service.
 *
 * @param {Object} data - The data containing information about the updated profile.
 * @param {string} userId - The ID of the learner.
 * @param {Object} res - The Express response object.
 * @returns {Object} - The response object indicating success or failure.
 */
exports.studentUpdateProfileService = async (data, userId, res) => {
  const { email, password } = data;

  // If email is taken
  const emailExist = await Learner.findOne({ email });
  if (emailExist) {
    return responseStatus(res, 402, "failed", "This email is taken/exist");
  }

  // Hash password and update
  if (password) {
    const learner = await Learner.findByIdAndUpdate(
        userId,
        {
          email,
          password: await hashPassword(password),
        },
        {
          new: true,
          runValidators: true,
        }
    );
    return responseStatus(res, 200, "success", learner);
  } else {
    const learner = await Learner.findByIdAndUpdate(
        userId,
        { email },
        {
          new: true,
          runValidators: true,
        }
    );
    return responseStatus(res, 200, "success", learner);
  }
};

/**
 * Admin update Learner service.
 *
 * @param {Object} data - The data containing information about the updated learner.
 * @param {string} studentId - The ID of the learner.
 * @param {Object} res - The Express response object.
 * @returns {Object} - The response object indicating success or failure.
 */
exports.adminUpdateLearnerService = async (data, studentId, res) => {
  const { classLevels, academicYear, program, name, email, prefectName } = data;

  // Find the learner by id
  const studentFound = await Learner.findById(studentId);
  if (!studentFound) {
    return responseStatus(res, 402, "failed", "Learner not found");
  }

  // Update
  const studentUpdated = await Learner.findByIdAndUpdate(
      studentId,
      {
        $set: {
          name,
          email,
          academicYear,
          program,
          prefectName,
        },
        $addToSet: {
          classLevels,
        },
      },
      {
        new: true,
      }
  );

  // Invalidate the cache
  await redisClient.del(`learner:${studentId}`);
  await redisClient.del("learners"); // Optional: Clear all learners cache

  return responseStatus(res, 200, "success", studentUpdated);
};

/**
 * Learner write exam service.
 *
 * @param {string} data - The data containing information about the exam writing
 * @param {string} studentId - The ID of the learner.
 * @param {string} examId - The ID of the exam.
 * @param {Object} res - The Express response object.
 * @returns {void}
 */
exports.studentWriteExamService = async (data, studentId, examId, res) => {
  const { answers } = data;

  // Find the learner
  const learner = await Learner.findById(studentId);
  if (!learner) return responseStatus(res, 404, "failed", "Learner not found");

  // Finding the exam
  const findExam = await Exam.findById(examId);
  if (!findExam) return responseStatus(res, 404, "failed", "Exam not found");

  // Check if exam is already taken
  const result = await Results.findOne({ studentId, examId });
  if (result) {
    return responseStatus(res, 403, "failed", "Exam already taken");
  }

  // Calculate results
  const score = resultCalculate(answers, findExam.questions);
  await Results.create({ score, examId, studentId });

  return responseStatus(res, 200, "success", "Exam completed successfully");
};

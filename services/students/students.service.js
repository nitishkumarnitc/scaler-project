const {
  hashPassword,
  isPassMatched,
} = require("../../handlers/pass_hash.handler");
const Admin = require("../../models/Staff/admin.model");
const Student = require("../../models/Students/students.model");
const Exam = require("../../models/Academic/exams.model");
const Results = require("../../models/Academic/results.model");
const generateToken = require("../../utils/token_generator");
const responseStatus = require("../../handlers/response_status.handler");
const { resultCalculate } = require("../../functions/result_calculate.function");
const redisClient = require("../../config/redis_connect"); // Assuming you have a Redis client set up

/**
 * Admin registration service for creating a new student.
 *
 * @param {Object} data - The data containing information about the new student.
 * @param {string} data.name - The name of the student.
 * @param {string} data.email - The email of the student.
 * @param {string} data.password - The password of the student.
 * @param {Object} res - The Express response object.
 * @returns {Object} - The response object indicating success or failure.
 */
exports.adminRegisterStudentService = async (data, adminId, res) => {
  const { name, email, password } = data;

  // Finding admin
  const admin = await Admin.findById(adminId);
  if (!admin) {
    return responseStatus(res, 405, "failed", "Unauthorized access!");
  }

  // Check if student already exists
  const student = await Student.findOne({ email });
  if (student) {
    return responseStatus(res, 402, "failed", "Student already enrolled");
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Create student
  const studentRegistered = await Student.create({
    name,
    email,
    password: hashedPassword,
  });

  // Saving to admin
  admin.students.push(studentRegistered._id);
  await admin.save();

  return responseStatus(res, 200, "success", studentRegistered);
};

/**
 * Student login service.
 *
 * @param {Object} data - The data containing information about the login.
 * @param {string} data.email - The email of the student.
 * @param {string} data.password - The password of the student.
 * @param {Object} res - The Express response object.
 * @returns {Object} - The response object indicating success or failure.
 */
exports.studentLoginService = async (data, res) => {
  const { email, password } = data;

  // Find the user
  const student = await Student.findOne({ email }).select("-password ");
  if (!student) {
    return responseStatus(res, 402, "failed", "Invalid login credentials");
  }

  // Verify the password
  const isMatched = await isPassMatched(password, student?.password);
  if (!isMatched) {
    return responseStatus(res, 401, "failed", "Invalid login credentials");
  }

  const responseData = { student, token: generateToken(student._id) };
  return responseStatus(res, 200, "success", responseData);
};

/**
 * Get student profile service.
 *
 * @param {string} id - The ID of the student.
 * @param {Object} res - The Express response object.
 * @returns {Object} - The response object indicating success or failure.
 */
exports.getStudentsProfileService = async (id, res) => {
  const cacheKey = `student:${id}`;

  // Check the cache first
  const cachedStudent = await redisClient.get(cacheKey);
  if (cachedStudent) {
    return responseStatus(res, 200, "success", JSON.parse(cachedStudent));
  }

  const student = await Student.findById(id).select(
      "-password -createdAt -updatedAt"
  );

  if (!student) {
    return responseStatus(res, 402, "failed", "Student not found");
  }

  // Cache the result
  await redisClient.set(cacheKey, JSON.stringify(student), "EX", 3600); // Cache for 1 hour
  return responseStatus(res, 200, "success", student);
};

/**
 * Get all students service (for admin use).
 *
 * @param {Object} res - The Express response object.
 * @returns {Array} - An array of all students.
 */
exports.getAllStudentsByAdminService = async (res) => {
  const cacheKey = "students";

  // Check the cache for students
  const cachedStudents = await redisClient.get(cacheKey);
  if (cachedStudents) {
    return responseStatus(res, 200, "success", JSON.parse(cachedStudents));
  }

  // Retrieve from the database if not cached
  const students = await Student.find({}).select("-password -createdAt -updatedAt");

  // Cache the result
  await redisClient.set(cacheKey, JSON.stringify(students), "EX", 3600); // Cache for 1 hour

  return responseStatus(res, 200, "success", students);
};

/**
 * Get a single student by admin.
 *
 * @param {string} studentID - The ID of the student.
 * @param {Object} res - The Express response object.
 * @returns {Object} - The response object indicating success or failure.
 */
exports.getStudentByAdminService = async (studentID, res) => {
  const cacheKey = `student:${studentID}`;

  // Check the cache first
  const cachedStudent = await redisClient.get(cacheKey);
  if (cachedStudent) {
    return responseStatus(res, 200, "success", JSON.parse(cachedStudent));
  }

  const student = await Student.findById(studentID);
  if (!student) {
    return responseStatus(res, 402, "failed", "Student not found");
  }

  // Cache the result
  await redisClient.set(cacheKey, JSON.stringify(student), "EX", 3600); // Cache for 1 hour
  return responseStatus(res, 200, "success", student);
};

/**
 * Student update profile service.
 *
 * @param {Object} data - The data containing information about the updated profile.
 * @param {string} userId - The ID of the student.
 * @param {Object} res - The Express response object.
 * @returns {Object} - The response object indicating success or failure.
 */
exports.studentUpdateProfileService = async (data, userId, res) => {
  const { email, password } = data;

  // If email is taken
  const emailExist = await Student.findOne({ email });
  if (emailExist) {
    return responseStatus(res, 402, "failed", "This email is taken/exist");
  }

  // Hash password and update
  if (password) {
    const student = await Student.findByIdAndUpdate(
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
    return responseStatus(res, 200, "success", student);
  } else {
    const student = await Student.findByIdAndUpdate(
        userId,
        { email },
        {
          new: true,
          runValidators: true,
        }
    );
    return responseStatus(res, 200, "success", student);
  }
};

/**
 * Admin update Student service.
 *
 * @param {Object} data - The data containing information about the updated student.
 * @param {string} studentId - The ID of the student.
 * @param {Object} res - The Express response object.
 * @returns {Object} - The response object indicating success or failure.
 */
exports.adminUpdateStudentService = async (data, studentId, res) => {
  const { classLevels, academicYear, program, name, email, prefectName } = data;

  // Find the student by id
  const studentFound = await Student.findById(studentId);
  if (!studentFound) {
    return responseStatus(res, 402, "failed", "Student not found");
  }

  // Update
  const studentUpdated = await Student.findByIdAndUpdate(
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
  await redisClient.del(`student:${studentId}`);
  await redisClient.del("students"); // Optional: Clear all students cache

  return responseStatus(res, 200, "success", studentUpdated);
};

/**
 * Student write exam service.
 *
 * @param {string} data - The data containing information about the exam writing
 * @param {string} studentId - The ID of the student.
 * @param {string} examId - The ID of the exam.
 * @param {Object} res - The Express response object.
 * @returns {void}
 */
exports.studentWriteExamService = async (data, studentId, examId, res) => {
  const { answers } = data;

  // Find the student
  const student = await Student.findById(studentId);
  if (!student) return responseStatus(res, 404, "failed", "Student not found");

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

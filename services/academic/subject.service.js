// Import necessary models
const Subject = require("../../models/Academic/subject.model");
const Program = require("../../models/Academic/program.model");
const responseStatus = require("../../handlers/response_status.handler");
const redisClient = require("../../config/redis_connect"); // Ensure Redis is configured

/**
 * Create Subject service.
 *
 * @param {Object} data - The data containing information about the Subject.
 * @param {string} data.name - The name of the Subject.
 * @param {string} data.description - The description of the Subject.
 * @param {string} data.academicTerm - The academic term associated with the Subject.
 * @param {string} programId - The ID of the program the Subject is associated with.
 * @param {string} userId - The ID of the user creating the Subject.
 * @returns {Object} - The response object indicating success or failure.
 */
exports.createSubjectService = async (data, programId, userId, res) => {
  const { name, description, academicTerm } = data;

  // Find the program
  const programFound = await Program.findById(programId);
  if (!programFound) {
    return responseStatus(res, 404, "failed", "Program not found");
  }

  // Check if the Subject already exists
  const subjectExists = await Subject.findOne({ name });
  if (subjectExists) {
    return responseStatus(res, 409, "failed", "Subject already exists");
  }

  // Create the Subject
  const subjectCreated = await Subject.create({
    name,
    description,
    academicTerm,
    createdBy: userId,
  });

  // Update the program with the new Subject ID
  programFound.subjects.push(subjectCreated._id);
  await programFound.save();

  // Invalidate cache
  await redisClient.del("subjects");

  // Send the response
  return responseStatus(res, 201, "success", subjectCreated);
};

/**
 * Get all Subjects service.
 *
 * @returns {Array} - An array of all Subjects.
 */
exports.getAllSubjectsService = async (res) => {
  const cacheKey = "subjects";

  // Check cache first
  const cachedSubjects = await redisClient.get(cacheKey);
  if (cachedSubjects) {
    return responseStatus(res, 200, "success", JSON.parse(cachedSubjects));
  }

  // If not in cache, retrieve from DB
  const subjects = await Subject.find();
  await redisClient.set(cacheKey, JSON.stringify(subjects)); // Cache the result

  return responseStatus(res, 200, "success", subjects);
};

/**
 * Get a single Subject by ID service.
 *
 * @param {string} id - The ID of the Subject.
 * @param {Object} res - The response object.
 * @returns {Object} - The Subject object.
 */
exports.getSubjectByIdService = async (id, res) => {
  const cacheKey = `subject:${id}`;

  // Check cache first
  const cachedSubject = await redisClient.get(cacheKey);
  if (cachedSubject) {
    return responseStatus(res, 200, "success", JSON.parse(cachedSubject));
  }

  // If not in cache, retrieve from DB
  const subject = await Subject.findById(id);
  if (!subject) {
    return responseStatus(res, 404, "failed", "Subject not found");
  }

  await redisClient.set(cacheKey, JSON.stringify(subject)); // Cache the result
  return responseStatus(res, 200, "success", subject);
};

/**
 * Update Subject data service.
 *
 * @param {Object} data - The data containing updated information about the Subject.
 * @param {string} data.name - The updated name of the Subject.
 * @param {string} data.description - The updated description of the Subject.
 * @param {string} data.academicTerm - The updated academic term associated with the Subject.
 * @param {string} id - The ID of the Subject to be updated.
 * @param {string} userId - The ID of the user updating the Subject.
 * @returns {Object} - The response object indicating success or failure.
 */
exports.updateSubjectService = async (data, id, userId, res) => {
  const { name, description, academicTerm } = data;

  // Check if the updated name already exists
  const subjectExists = await Subject.findOne({ name });
  if (subjectExists) {
    return responseStatus(res, 409, "failed", "Subject already exists");
  }

  // Update the Subject
  const updatedSubject = await Subject.findByIdAndUpdate(
      id,
      {
        name,
        description,
        academicTerm,
        createdBy: userId,
      },
      { new: true }
  );

  if (!updatedSubject) {
    return responseStatus(res, 404, "failed", "Subject not found");
  }

  // Invalidate cache
  await redisClient.del("subjects");
  await redisClient.del(`subject:${id}`);

  // Send the response
  return responseStatus(res, 200, "success", updatedSubject);
};

/**
 * Delete Subject data service.
 *
 * @param {string} id - The ID of the Subject to be deleted.
 * @param {Object} res - The response object.
 * @returns {Object} - The deleted Subject object or response indicating failure.
 */
exports.deleteSubjectService = async (id, res) => {
  const deletedSubject = await Subject.findByIdAndDelete(id);
  if (!deletedSubject) {
    return responseStatus(res, 404, "failed", "Subject not found");
  }

  // Invalidate cache
  await redisClient.del("subjects");
  await redisClient.del(`subject:${id}`);

  return responseStatus(res, 200, "success", deletedSubject);
};

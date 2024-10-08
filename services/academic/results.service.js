const responseStatus = require("../../handlers/response_status.handler");
const ExamResult = require("../../models/Academic/results.model");

/**
 * Service to check exam result for a learner using caching
 * @param {string} examId - The ID of the exam
 * @param {string} studentId - The ID of the learner
 * @param {Object} res - Express response object
 */
exports.studentCheckExamResultService = async (examId, studentId, res) => {
  const query = { exam: examId, learner: studentId };

  try {
    // Use the `findWithCache` method to fetch the exam result, leveraging Redis cache
    const result = await ExamResult.findWithCache(query)
        .populate({
          path: "exam",
          populate: { path: "questions" },
        })
        .populate("classLevel")
        .populate("subject")
        .populate("academicTerm")
        .populate("academicYear");

    // Check if the result exists and is published
    if (!result || !result.isPublished) {
      return responseStatus(
          res,
          400,
          "failed",
          "Result is not published yet! Please wait for further notice"
      );
    }

    return responseStatus(res, 200, "success", result);
  } catch (error) {
    return responseStatus(res, 500, "error", "An error occurred");
  }
};

/**
 * Service to get all exam results for a class by a instructor using caching
 * @param {string} classId - The ID of the class
 * @param {string} instructorId - The ID of the instructor
 * @param {Object} res - Express response object
 */
exports.getAllExamResultsService = async (classId, instructorId, res) => {
  const query = { classLevel: classId };

  try {
    // Use the `findWithCache` method to fetch class exam results
    const results = await ExamResult.findWithCache(query);

    // Ensure the instructor has access to the results
    if (results.length && results[0].instructor.equals(instructorId)) {
      return responseStatus(res, 200, "success", results);
    } else {
      return responseStatus(res, 401, "fail", "Unauthorized access");
    }
  } catch (error) {
    return responseStatus(res, 500, "error", "An error occurred");
  }
};

/**
 * Admin publishes the exam result and clears the cache
 * @param {string} examId - The ID of the exam
 * @param {Object} res - Express response object
 */
exports.adminPublishResultService = async (examId, res) => {
  try {
    // Find the exam result by examId
    const exam = await ExamResult.findById(examId);

    if (!exam) {
      return responseStatus(res, 404, "fail", "Exam not found");
    }

    // Publish the exam result
    exam.isPublished = true;
    await exam.save();

    // Clear the cache for the published exam result
    await ExamResult.clearCache({ exam: examId });

    return responseStatus(res, 200, "success", "Exam result published successfully");
  } catch (error) {
    return responseStatus(res, 500, "error", "An error occurred");
  }
};

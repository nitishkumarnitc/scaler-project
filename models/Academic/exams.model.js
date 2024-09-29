const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const redisClient = require("../../config/redis_connect"); // Import Redis client

// Exam Schema
const examSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            index: true,
        },
        description: {
            type: String,
            required: true,
        },
        subject: {
            type: ObjectId,
            ref: "Subject",
            required: true,
        },
        program: {
            type: ObjectId,
            ref: "Program",
            required: true,
        },
        passMark: {
            type: Number,
            required: true,
            default: 50,
        },
        totalMark: {
            type: Number,
            required: true,
            default: 100,
        },
        duration: {
            type: String,
            required: true,
            default: "30 minutes",
        },
        examDate: {
            type: Date,
            required: true,
            default: new Date(),
        },
        examTime: {
            type: String,
            required: true,
        },
        examType: {
            type: String,
            required: true,
            default: "Quiz",
        },
        examStatus: {
            type: String,
            required: true,
            default: "pending",
            enum: ["pending", "live"],
        },
        questions: [
            {
                type: ObjectId,
                ref: "Question",
            },
        ],
        classLevel: {
            type: ObjectId,
            ref: "ClassLevel",
            required: true,
        },
        createdBy: {
            type: ObjectId,
            ref: "Instructor",
            required: true,
        },
        academicTerm: {
            type: ObjectId,
            ref: "AcademicTerm",
            required: true,
        },
        academicYear: {
            type: ObjectId,
            ref: "AcademicYear",
            required: true,
        },
    },
    { timestamps: true }
);

const Exam = mongoose.model("Exam", examSchema);

// Caching Logic
const getAllExams = async () => {
    const cacheKey = "exams_cache";

    // Check Redis cache first
    const cachedResult = await redisClient.get(cacheKey);
    if (cachedResult) {
        console.log("Serving from cache");
        return JSON.parse(cachedResult); // Parse the cached data
    }

    // If not in cache, query the database
    const exams = await Exam.find().populate("subject program classLevel createdBy academicTerm academicYear");

    // Store in Redis cache
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(exams)); // Cache for 1 hour

    return exams;
};

const createExam = async (data, instructorId) => {
    const {
        name,
        description,
        subject,
        program,
        passMark,
        totalMark,
        academicTerm,
        duration,
        examDate,
        examTime,
    } = data;

    // Check if the exam already exists
    const examFound = await Exam.findOne({ name });
    if (examFound) {
        throw new Error("Exam already exists");
    }

    // Create the exam
    const examCreated = await Exam.create({
        name,
        description,
        subject,
        program,
        passMark,
        totalMark,
        academicTerm,
        duration,
        examDate,
        examTime,
        createdBy: instructorId,
    });

    // Clear the cache
    await redisClient.del("exams_cache");

    return examCreated;
};

const updateExam = async (id, data) => {
    const {
        name,
        description,
        subject,
        program,
        academicTerm,
        duration,
        examDate,
        examTime,
        examType,
        createdBy,
        academicYear,
        classLevel,
    } = data;

    // Check if the updated name already exists
    const examFound = await Exam.findOne({ name });
    if (examFound) {
        throw new Error("Exam already exists");
    }

    // Update the exam
    const examUpdated = await Exam.findByIdAndUpdate(
        id,
        {
            name,
            description,
            subject,
            program,
            academicTerm,
            duration,
            examDate,
            examTime,
            examType,
            createdBy,
            academicYear,
            classLevel,
        },
        {
            new: true,
        }
    );

    // Clear the cache
    await redisClient.del("exams_cache");

    return examUpdated;
};

const deleteExam = async (id) => {
    // Clear the cache before deletion
    await redisClient.del("exams_cache");
    return await Exam.findByIdAndDelete(id);
};

// Export the model and methods
module.exports = {
    Exam,
    getAllExams,
    createExam,
    updateExam,
    deleteExam,
};

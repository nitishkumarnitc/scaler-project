const mongoose = require("mongoose");
const redisClient = require("../../config/redis_connect"); // Import the Redis client
const { ObjectId } = mongoose.Schema;

const CACHE_EXPIRATION = 3600; // Cache expiration time in seconds (1 hour)

// Exam result schema
const examResultSchema = new mongoose.Schema(
    {
        learner: {
            type: ObjectId,
            ref: "Learner",
            required: true,
        },
        exam: {
            type: ObjectId,
            ref: "Exam",
            required: true,
        },
        grade: {
            type: Number,
            required: true,
        },
        score: {
            type: Number,
            required: true,
        },
        passMark: {
            type: Number,
            required: true,
            default: 50,
        },
        answeredQuestions: [
            {
                type: Object,
            },
        ],
        status: {
            type: String,
            required: true,
            enum: ["failed", "passed"],
            default: "failed",
        },
        remarks: {
            type: String,
            required: true,
            enum: ["Excellent", "Good", "Poor"],
            default: "Poor",
        },
        position: {
            type: Number,
        },
        instructor: {
            type: ObjectId,
            ref: "Instructor",
            required: true,
        },
        subject: {
            type: ObjectId,
            ref: "Subject",
        },
        classLevel: {
            type: ObjectId,
            ref: "ClassLevel",
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
        isPublished: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// Middleware to cache queries
examResultSchema.statics.findWithCache = async function (query) {
    const cacheKey = JSON.stringify(query); // Unique key for Redis

    // Try to fetch the result from Redis cache
    const cachedResult = await redisClient.get(cacheKey);

    if (cachedResult) {
        console.log('Serving from cache');
        return JSON.parse(cachedResult);
    }

    // If not in cache, query the database
    const result = await this.find(query);

    // Store the result in Redis for future queries
    await redisClient.setEx(cacheKey, CACHE_EXPIRATION, JSON.stringify(result)); // Changed to await

    return result;
};

// Method to clear cache when data is updated
examResultSchema.statics.clearCache = async function (query) {
    const cacheKey = JSON.stringify(query);
    await redisClient.del(cacheKey); // Clear cache for the specific query
};

const ExamResult = mongoose.model("ExamResult", examResultSchema);

module.exports = ExamResult;

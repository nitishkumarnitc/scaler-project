const mongoose = require("mongoose");
const redis = require("redis");
const util = require("util");
const {get} = require("../../config/redis_connect");

const { ObjectId } = mongoose.Schema;

// Setup Redis client
const redisClient = get;

const CACHE_EXPIRATION = 3600; // Cache expiration time in seconds (1 hour)

// Exam result schema
const examResultSchema = new mongoose.Schema(
    {
        student: {
            type: ObjectId,
            ref: "Student",
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
        teacher: {
            type: ObjectId,
            ref: "Teacher",
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
    redisClient.setex(cacheKey, CACHE_EXPIRATION, JSON.stringify(result));

    return result;
};

// Method to clear cache when data is updated
examResultSchema.statics.clearCache = async function (query) {
    const cacheKey = JSON.stringify(query);
    redisClient.del(cacheKey); // Clear cache for the specific query
};

const ExamResult = mongoose.model("ExamResult", examResultSchema);

module.exports = ExamResult;

const mongoose = require("mongoose");
const redisClient = require("../../config/redis_connect"); // Import the Redis client
const { ObjectId } = mongoose.Schema;

const CACHE_EXPIRATION = 3600; // Cache expiration time in seconds (1 hour)

const academicTermSchema = new mongoose.Schema(
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
        duration: {
            type: String,
            required: true,
            default: "3 months",
        },
        createdBy: {
            type: ObjectId,
            ref: "Admin",
            required: true,
        },
    },
    { timestamps: true }
);

// Middleware to cache queries
academicTermSchema.statics.findWithCache = async function (query) {
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
academicTermSchema.statics.clearCache = async function (query) {
    const cacheKey = JSON.stringify(query);
    await redisClient.del(cacheKey); // Clear cache for the specific query
};

const AcademicTerm = mongoose.model("AcademicTerm", academicTermSchema);

module.exports = AcademicTerm;

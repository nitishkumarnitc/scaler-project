// models/Academic/academic_year.model.js
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const redisClient = require("../../config/redis_connect"); // Import Redis client

const academicYearSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            index: true,
        },
        fromYear: {
            type: Date,
            required: true,
        },
        toYear: {
            type: Date,
            required: true,
        },
        isCurrent: {
            type: Boolean,
            default: false,
        },
        createdBy: {
            type: ObjectId,
            ref: "Admin",
            required: true,
        },
        students: [
            {
                type: ObjectId,
                ref: "Student",
            },
        ],
        teachers: [
            {
                type: ObjectId,
                ref: "Teacher",
            },
        ],
    },
    {
        timestamps: true,
    }
);

// Model
const AcademicYear = mongoose.model("AcademicYear", academicYearSchema);

// Caching Logic
const getAllAcademicYears = async () => {
    const cacheKey = "academic_years_cache";

    // Check Redis cache first
    const cachedResult = await redisClient.get(cacheKey);
    if (cachedResult) {
        console.log('Serving from cache');
        return JSON.parse(cachedResult); // Parse the cached data
    }

    // If not in cache, query the database
    const academicYears = await AcademicYear.find();

    // Store in Redis cache
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(academicYears)); // Cache for 1 hour

    return academicYears;
};

const createAcademicYear = async (data, userId) => {
    const { name, fromYear, toYear } = data;

    // Check if the academic year already exists
    const academicYear = await AcademicYear.findOne({ name });
    if (academicYear) {
        throw new Error("Academic year already exists");
    }

    // Create the academic year
    const academicYearCreated = await AcademicYear.create({
        name,
        fromYear,
        toYear,
        createdBy: userId,
    });

    // Clear the cache
    await redisClient.del("academic_years_cache");

    return academicYearCreated;
};

const updateAcademicYear = async (academicId, data, userId) => {
    const { name, fromYear, toYear } = data;

    // Check if the updated name already exists
    const createAcademicYearFound = await AcademicYear.findOne({ name });
    if (createAcademicYearFound) {
        throw new Error("Academic year already exists");
    }

    // Update the academic year
    const academicYear = await AcademicYear.findByIdAndUpdate(
        academicId,
        { name, fromYear, toYear, createdBy: userId },
        { new: true }
    );

    // Clear the cache
    await redisClient.del("academic_years_cache");

    return academicYear;
};

const deleteAcademicYear = async (id) => {
    // Clear the cache before deletion
    await redisClient.del("academic_years_cache");
    return await AcademicYear.findByIdAndDelete(id);
};

// Export the model and the methods
module.exports = {
    AcademicYear,
    getAllAcademicYears,
    createAcademicYear,
    updateAcademicYear,
    deleteAcademicYear,
};

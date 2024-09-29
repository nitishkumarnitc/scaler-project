// models/Academic/class.model.js
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const redisClient = require("../../config/redis_connect"); // Import Redis client

const ClassLevelSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            index: true,
        },
        description: {
            type: String,
        },
        createdBy: {
            type: ObjectId,
            ref: "Admin",
            required: true,
        },
        // students will be added to the class level when they are registered
        students: [
            {
                type: ObjectId,
                ref: "Student",
            },
        ],
        // optional.
        subjects: [
            {
                type: ObjectId,
                ref: "Subject",
            },
        ],
        instructors: [
            {
                type: ObjectId,
                ref: "Instructor",
            },
        ],
    },
    { timestamps: true }
);

const ClassLevel = mongoose.model("ClassLevel", ClassLevelSchema);

// Caching Logic
const getAllClasses = async () => {
    const cacheKey = "class_levels_cache";

    // Check Redis cache first
    const cachedResult = await redisClient.get(cacheKey);
    if (cachedResult) {
        console.log('Serving from cache');
        return JSON.parse(cachedResult); // Parse the cached data
    }

    // If not in cache, query the database
    const classLevels = await ClassLevel.find();

    // Store in Redis cache
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(classLevels)); // Cache for 1 hour

    return classLevels;
};

const createClassLevel = async (data, userId) => {
    const { name, description } = data;

    // Check if the class already exists
    const classFound = await ClassLevel.findOne({ name });
    if (classFound) {
        throw new Error("Class already exists");
    }

    // Create the class
    const classCreated = await ClassLevel.create({
        name,
        description,
        createdBy: userId,
    });

    // Clear the cache
    await redisClient.del("class_levels_cache");

    return classCreated;
};

const updateClassLevel = async (id, data, userId) => {
    const { name, description } = data;

    // Check if the updated name already exists
    const classFound = await ClassLevel.findOne({ name });
    if (classFound) {
        throw new Error("Class already exists");
    }

    // Update the class
    const classLevel = await ClassLevel.findByIdAndUpdate(
        id,
        {
            name,
            description,
            createdBy: userId,
        },
        {
            new: true,
        }
    );

    // Clear the cache
    await redisClient.del("class_levels_cache");

    return classLevel;
};

const deleteClassLevel = async (id) => {
    // Clear the cache before deletion
    await redisClient.del("class_levels_cache");
    return await ClassLevel.findByIdAndDelete(id);
};

// Export the model and the methods
module.exports = {
    ClassLevel,
    getAllClasses,
    createClassLevel,
    updateClassLevel,
    deleteClassLevel,
};

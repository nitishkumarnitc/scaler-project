const mongoose = require("mongoose");
const redisClient = require("../../config/redis_connect"); // Import Redis client

const { ObjectId } = mongoose.Schema;

const ProgramSchema = new mongoose.Schema(
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
            default: "4 years",
        },
        // created automatically
        code: {
            type: String,
            default: function () {
                return (
                    this.name
                        .split(" ")
                        .map((name) => name[0])
                        .join("")
                        .toUpperCase() +
                    Math.floor(10 + Math.random() * 90) +
                    Math.floor(10 + Math.random() * 90)
                );
            },
        },
        createdBy: {
            type: ObjectId,
            ref: "Admin",
            required: true,
        },
        teachers: [
            {
                type: ObjectId,
                ref: "Teacher",
            },
        ],
        students: [
            {
                type: ObjectId,
                ref: "Student",
                default: [],
            },
        ],
        subjects: [
            {
                type: ObjectId,
                ref: "Subject",
                default: [],
            },
        ],
    },
    { timestamps: true }
);

const Program = mongoose.model("Program", ProgramSchema);

// Caching Logic
const getAllPrograms = async () => {
    const cacheKey = "programs_cache";

    // Check Redis cache first
    const cachedResult = await redisClient.get(cacheKey);
    if (cachedResult) {
        console.log('Serving from cache');
        return JSON.parse(cachedResult); // Parse the cached data
    }

    // If not in cache, query the database
    const programs = await Program.find();

    // Store in Redis cache
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(programs)); // Cache for 1 hour

    return programs;
};

const createProgram = async (data, userId) => {
    const { name, description, duration } = data;

    // Check if the program already exists
    const programFound = await Program.findOne({ name });
    if (programFound) {
        throw new Error("Program already exists");
    }

    // Create the program
    const programCreated = await Program.create({
        name,
        description,
        duration,
        createdBy: userId,
    });

    // Clear the cache
    await redisClient.del("programs_cache");

    return programCreated;
};

const updateProgram = async (id, data) => {
    // Update the program
    const programUpdated = await Program.findByIdAndUpdate(id, data, {
        new: true,
    });

    // Clear the cache
    await redisClient.del("programs_cache");

    return programUpdated;
};

const deleteProgram = async (id) => {
    // Clear the cache before deletion
    await redisClient.del("programs_cache");
    return await Program.findByIdAndDelete(id);
};

// Export the model and the caching methods
module.exports = {
    Program,
    getAllPrograms,
    createProgram,
    updateProgram,
    deleteProgram,
};

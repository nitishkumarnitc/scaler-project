const mongoose = require("mongoose");
const redisClient = require("../../config/redis_connect"); // Import Redis client

const { ObjectId } = mongoose.Schema;

const subjectSchema = new mongoose.Schema(
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
        teacher: {
            type: ObjectId,
            ref: "Teacher",
        },
        academicTerm: {
            type: ObjectId,
            ref: "AcademicTerm",
            required: true,
        },
        createdBy: {
            type: ObjectId,
            ref: "Admin",
            required: true,
        },
        duration: {
            type: String,
            required: true,
            default: "3 months",
        },
    },
    { timestamps: true }
);

// Caching methods
subjectSchema.statics.createSubject = async function (data) {
    const subject = await this.create(data);
    await redisClient.del("subjects"); // Invalidate cache
    return subject;
};

subjectSchema.statics.getAllSubjects = async function () {
    const cacheKey = "subjects";

    // Check cache first
    const cachedSubjects = await redisClient.get(cacheKey);
    if (cachedSubjects) {
        return JSON.parse(cachedSubjects);
    }

    // If not in cache, retrieve from DB
    const subjects = await this.find();
    await redisClient.set(cacheKey, JSON.stringify(subjects)); // Cache the result
    return subjects;
};

subjectSchema.statics.getSubjectById = async function (subjectId) {
    const cacheKey = `subject:${subjectId}`;

    // Check cache first
    const cachedSubject = await redisClient.get(cacheKey);
    if (cachedSubject) {
        return JSON.parse(cachedSubject);
    }

    // If not in cache, retrieve from DB
    const subject = await this.findById(subjectId);
    if (subject) {
        await redisClient.set(cacheKey, JSON.stringify(subject)); // Cache the result
    }
    return subject;
};

subjectSchema.statics.updateSubject = async function (subjectId, data) {
    const subject = await this.findByIdAndUpdate(subjectId, data, { new: true });
    await redisClient.del("subjects"); // Invalidate cache
    await redisClient.del(`subject:${subjectId}`); // Invalidate specific subject cache
    return subject;
};

subjectSchema.statics.deleteSubject = async function (subjectId) {
    const deletedSubject = await this.findByIdAndDelete(subjectId);
    await redisClient.del("subjects"); // Invalidate cache
    await redisClient.del(`subject:${subjectId}`); // Invalidate specific subject cache
    return deletedSubject;
};

const Subject = mongoose.model("Subject", subjectSchema);

module.exports = Subject;

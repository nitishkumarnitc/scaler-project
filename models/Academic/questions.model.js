const mongoose = require("mongoose");
const redisClient = require("../../config/redis_connect"); // Import Redis client

const { ObjectId } = mongoose;

// Question schema
const questionSchema = new mongoose.Schema(
    {
        question: {
            type: String,
            required: true,
            index: true,
            text: true,
        },
        optionA: {
            type: String,
            required: true,
        },
        optionB: {
            type: String,
            required: true,
        },
        optionC: {
            type: String,
            required: true,
        },
        optionD: {
            type: String,
            required: true,
        },
        correctAnswer: {
            type: String,
            required: true,
        },
        isCorrect: {
            type: Boolean,
            default: false,
        },
        createdBy: {
            type: ObjectId,
            ref: "Teacher",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

// Method to create a question
questionSchema.statics.createQuestion = async function (data) {
    const question = await this.create(data);
    // Clear cache for questions
    await redisClient.del("questions_cache");
    return question;
};

// Method to get all questions with caching
questionSchema.statics.getAllQuestions = async function () {
    // Check Redis cache
    const cachedQuestions = await redisClient.get("questions_cache");
    if (cachedQuestions) {
        return JSON.parse(cachedQuestions);
    }

    // Fetch from database
    const questions = await this.find();
    // Cache the questions
    await redisClient.set("questions_cache", JSON.stringify(questions));
    return questions;
};

// Method to get a single question by ID
questionSchema.statics.getQuestionById = async function (id) {
    return await this.findById(id);
};

// Method to update a question
questionSchema.statics.updateQuestion = async function (id, data) {
    const updatedQuestion = await this.findByIdAndUpdate(id, data, {
        new: true,
    });
    // Clear cache for questions
    await redisClient.del("questions_cache");
    return updatedQuestion;
};

// Method to delete a question
questionSchema.statics.deleteQuestion = async function (id) {
    const deletedQuestion = await this.findByIdAndDelete(id);
    // Clear cache for questions
    await redisClient.del("questions_cache");
    return deletedQuestion;
};

const Question = mongoose.model("Question", questionSchema);

module.exports = Question;

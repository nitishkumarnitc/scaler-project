const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

// Define the schema for YearGroup
const yearGroupSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            index: true,
        },
        createdBy: {
            type: ObjectId,
            ref: "Admin",
            required: true,
        },
        academicYear: {
            type: ObjectId,
            ref: "AcademicYear",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

// Create and export the YearGroup model
const YearGroup = mongoose.model("YearGroup", yearGroupSchema);
module.exports = YearGroup;

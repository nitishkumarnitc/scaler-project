const mongoose = require("mongoose");

const { ObjectId } = mongoose.Schema;

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "admin",
    },
    academicTerms: [
      {
        type: ObjectId,
        ref: "AcademicTerm",
      },
    ],
    programs: [
      {
        type: ObjectId,
        ref: "Program",
      },
    ],
    yearGroups: [
      {
        type: ObjectId,
        ref: "YearGroup",
      },
    ],
    academicYears: [
      {
        type: ObjectId,
        ref: "AcademicYear",
      },
    ],
    classLevels: [
      {
        type: ObjectId,
        ref: "ClassLevel",
      },
    ],
    instructors: [
      {
        type: ObjectId,
        ref: "Instructor",
      },
    ],
    learners: [
      {
        type: ObjectId,
        ref: "Learner",
      },
    ],
  },
  {
    timestamps: true,
  }
);

//model
const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;

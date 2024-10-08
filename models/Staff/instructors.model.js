const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const instructorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
    },
    dateEmployed: {
      type: Date,
      default: Date.now,
    },
    instructorId: {
      type: String,
      required: true,
      default: function () {
        return (
          "TEA" +
          Math.floor(100 + Math.random() * 900) +
          Date.now().toString().slice(2, 4) +
          this.name
            .split(" ")
            .map((name) => name[0])
            .join("")
            .toUpperCase()
        );
      },
    },
    //if withdrawn, the instructor will not be able to login
    isWithdrawn: {
      type: Boolean,
      default: false,
    },
    //if suspended, the instructor can login but cannot perform any task
    isSuspended: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      default: "instructor",
    },
    subject: {
      type: ObjectId,
      ref: "Subject",
      // required: true,
    },
    applicationStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    program: {
      type: String,
    },
    //A instructor can teach in more than one class level
    classLevel: {
      type: String,
    },
    academicYear: {
      type: String,
    },
    examsCreated: [
      {
        type: ObjectId,
        ref: "Exam",
      },
    ],
    createdBy: {
      type: ObjectId,
      ref: "Admin",
      required: true,
    },
    academicTerm: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

//model
const Instructor = mongoose.model("Instructor", instructorSchema);

module.exports = Instructor;

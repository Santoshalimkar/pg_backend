const mongoose = require("mongoose");

const StaffSchema = new mongoose.Schema(
  {
    name: {
      type: "string",
      required: true,
    },
    Number: {
      type: Number,
      required: true,
    },
    Category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    mothlysalary: {
      type: Number,
      required: true,
    },
    Salary: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Salary",
        required: true,
      },
    ],
    salarypaidmonth: {
      type: String,
    },
  },
  { timestamps: true }
);

const StaffModel = mongoose.model("Staff", StaffSchema);

module.exports = StaffModel;

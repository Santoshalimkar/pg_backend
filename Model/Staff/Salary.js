const mongoose = require("mongoose");

const SalarySchema = new mongoose.Schema(
  {
    staff: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Staff",
      required: true,
    },
    Amount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const SalaryModel = mongoose.model("Salary", SalarySchema);

module.exports = SalaryModel;

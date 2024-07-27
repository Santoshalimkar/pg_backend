const mongoose = require("mongoose");

const ExpenseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    amount: {
      type: Number,
      required: true,
    },
    Categoery: {
      type: String,
      required: true,
    },
    month: {
      type: Number,
      required: true,
    },
    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const ExpenseModel = mongoose.model("Expense", ExpenseSchema);
module.exports = ExpenseModel;

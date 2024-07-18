const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema(
  {
    user:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "teantants",
      required: true,
    },
    UserId: {
      type: String,
      required: true,
    },
    branch: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Branch",
        required: true,
      },
    ],
    Amount: {
      type: Number,
      required: true,
    },
    Maintaince: {
      type: Number,
      default: 0,
    },
    Security: {
      type: Number,
      default: 0,
    },
    DueAmount: {
      type: Number,
      default: 0,
    },
    NumberOfmonth: {
      type: Number,
    },
    PayemntDate: {
      type: Date,
    },
    LastDueDate: {
      type: String,
    },
  },
  { timestamps: true }
);

const PaymentModel = mongoose.model("Payment", PaymentSchema);

module.exports = PaymentModel;

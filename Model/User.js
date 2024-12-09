const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    UserName: {
      type: String,
      required: true,
    },
    AadharNumber: {
      type: Number,
      unique: true,
    },
    Address: {
      type: String,
    },
    Email: {
      type: String,
    },
    UserId: {
      type: String,
      required: true,
    },
    UserNumber: {
      type: Number,
      required: true,
    },
    BookedDate: {
      type: Date,
      required: true,
    },
    StartDate: {
      type: String,
      required: true,
    },
    LastDate: {
      type: String,
      required: true,
    },
    Status: {
      type: String,
      required: true,
    },
    DueAmount: {
      type: Number,
      required: true,
    },
    room: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room",
        required: true,
      },
    ],
    branch: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Branch",
        required: true,
      },
    ],
    Payment: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Payment",
        required: true,
      },
    ],
    files: {
      profile: [String],
      aadhar: [String],
      optional: [String]
    },
    NumberOfmonth: {
      type: Number,
    },
    leftroom: {
      type: Boolean,
      required: true,
      default: false,
    },
    devicetoken: {
      type: String
    }
  },
  { timestamps: true }
);

const UserModel = mongoose.model("teantants", UserSchema);

module.exports = UserModel;

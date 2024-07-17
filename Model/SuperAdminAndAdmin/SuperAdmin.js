const mongoose = require("mongoose");

const SuperAdminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    Email: {
      type: String,
      required: true,
      unique: true,
    },
    Number: {
      type: Number,
      required: true,
      unique: true,
    },
    Password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    blocked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const SuperAdminModel = mongoose.model("SuperAdmin", SuperAdminSchema);
module.exports = SuperAdminModel;

const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    Email: {
      type: String,
      required: true,
    },
    Number: {
      type: Number,
      required: true,
    },
    Password: {
      type: String,
      required: true,
    },
    branch: {
      type:[],
    },
    permission: {
      type: [],
    },
    role: {
      type: String,
      required: true,
      default: 'admin'
    },
    activate: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const AdminModel = mongoose.model("Admin", AdminSchema);
module.exports = AdminModel;

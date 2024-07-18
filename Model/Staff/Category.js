const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: "string",
      required: true,
    },
    Staff: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Staff", required: true },
    ],
  },
  { timestamps: true }
);

const CategoryModel = mongoose.model("Category", CategorySchema);

module.exports = CategoryModel;

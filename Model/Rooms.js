const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema(
  {
    roomName: {
      type: String,
      required: true,
    },
    RoomNumber: {
      type: String,
      required: true,
    },
    RoomType: {
      type: String,
      required: true,
      enum: ["AC", "NON-AC"],
    },
    RoomDetails: [],
    SharingType: {
      type: Number,
      required: true,
    },
    Price: {
      type: Number,
      required: true,
    },
    reaminingBed: {
      type: Number,
      required: true,
    },
    images: [],
    branch: {
      type: String,
      required: true,
    },
    floor: {
      type: String,
      required: true,
    },
    Users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "teantants",
        required: true,
      },
    ],
  },
  { timestamps: true }
);

const RoomModel = mongoose.model("Room", RoomSchema);

module.exports = RoomModel;

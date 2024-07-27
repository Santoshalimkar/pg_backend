const mongoose = require("mongoose");

const TicketSchema = new mongoose.Schema(
  {
    ticketId: {
      type: Number,
      required: true,
    },
    TicketName: {
      type: String,
      required: true,
    },
    TicketDescription: {
      type: String,
      required: true,
    },
    Categoery: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["pending", "resolved", "closed"],
    },
    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "teantants",
      required: true,
    },
    remark: {
      type: String,
    },
  },
  { timestamps: true }
);

const Tickemodel = mongoose.model("Ticket", TicketSchema);
module.exports = Tickemodel;

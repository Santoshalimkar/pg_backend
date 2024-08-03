const express = require("express");
const { isUser } = require("../MiddleWare/IsUser");
const {
  CreateTicket,
  GetTicketbybranch,
  GetTicketbystatus,
  GetAllMyTicket,
  ResolveTicket,
  CloseTicket,
} = require("../Controller/Tickets");
const { IsSuperOrAdmin } = require("../MiddleWare/isSuperOrAdmin");
const { body } = require("express-validator");

const TicketRouter = express.Router();

TicketRouter.post(
  "/create/ticket",
  body("TicketName").notEmpty().withMessage("Ticket Name is required"),
  body("TicketDescription")
    .notEmpty()
    .withMessage("Ticket Description is required"),
  body("Categoery").notEmpty().withMessage("Categoery is required"),
  body("branch").notEmpty().withMessage("branch is required"),
  isUser,
  CreateTicket
);
TicketRouter.get("/getmy/ticket", isUser, GetAllMyTicket);
TicketRouter.get(
  "/get/ticket/branch/:branchId",
  // IsSuperOrAdmin,
  GetTicketbybranch
);
TicketRouter.get(
  "/get/ticket/status/:status",
  IsSuperOrAdmin,
  GetTicketbystatus
);

TicketRouter.put(
  "/resolve/ticket/:ticketId",
  body("remark").notEmpty().withMessage("remark is required"),
  IsSuperOrAdmin,
  ResolveTicket
);

TicketRouter.put("/close/ticket/:ticketId", isUser, CloseTicket);


module.exports = TicketRouter
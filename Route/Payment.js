const express = require("express");
const { IsSuperOrAdmin } = require("../MiddleWare/isSuperOrAdmin");
const {
  CreatePayment,
  CalculateRent,
  UpdatePayment,
  GetAllPaymentOfBranch,
  SinglePayment,
} = require("../Controller/Payments");
const { body } = require("express-validator");

const paymentRouter = express.Router();

paymentRouter.post(
  "/create/payment",
  body("UserId").notEmpty().withMessage("User ID is  Required"),
  body("Amount").notEmpty().withMessage("Amount is  Required"),
  body("LastDueDate").notEmpty().withMessage("Last Paid Date is  Required"),
  body("branch").notEmpty().withMessage("branch is  Required"),
  IsSuperOrAdmin,
  CreatePayment
);

paymentRouter.post(
  "/calculate/rent",
  body("UserId").notEmpty().withMessage("User ID is  Required"),
  body("lastdate").notEmpty().withMessage("Last Date is  Required"),
  IsSuperOrAdmin,
  CalculateRent
);

paymentRouter.put(
  "/update/payment/:paymentId",
  body("UserId").notEmpty().withMessage("User ID is  Required"),
  body("Amount").notEmpty().withMessage("Amount is  Required"),
  body("LastDueDate").notEmpty().withMessage("Last Paid Date is  Required"),
  body("branch").notEmpty().withMessage("branch is  Required"),
  IsSuperOrAdmin,
  UpdatePayment
);

paymentRouter.get(
  "/get/payment/:branchId",
  IsSuperOrAdmin,
  GetAllPaymentOfBranch
);

paymentRouter.get(
  "/get/singlepayment/:paymentId",
  IsSuperOrAdmin,
  SinglePayment
);

module.exports = paymentRouter;

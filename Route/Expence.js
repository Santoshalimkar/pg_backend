const express = require("express");
const { IsSuperAdmin } = require("../MiddleWare/IsSuperAdmin");
const {
  createExpense,
  UpdateExpense,
  GetAllExpenses,
  GetSinlgeExpences,
} = require("../Controller/Expense");
const { body } = require("express-validator");
const { IsSuperOrAdmin } = require("../MiddleWare/isSuperOrAdmin");

const expenceRouter = express.Router();

expenceRouter.post(
  "/create/expence",
  body("name").notEmpty().withMessage("Expence name is required"),
  body("amount").notEmpty().withMessage("Expence amount is required"),
  body("Categoery").notEmpty().withMessage("Expence Categoery is required"),
  body("month").notEmpty().withMessage("Expence month is required"),
  body("branch").notEmpty().withMessage("branch Id is required"),
  IsSuperOrAdmin,
  createExpense
);

expenceRouter.put(
  "/create/expence/:id",
  body("name").notEmpty().withMessage("Expence name is required"),
  body("amount").notEmpty().withMessage("Expence amount is required"),
  body("Categoery").notEmpty().withMessage("Expence Categoery is required"),
  body("month").notEmpty().withMessage("Expence month is required"),
  body("branch").notEmpty().withMessage("branch Id is required"),
  IsSuperOrAdmin,
  UpdateExpense
);

expenceRouter.get(
  "/get/expense/branch/:branchId",
  IsSuperOrAdmin,
  GetAllExpenses
);

expenceRouter.get("/get/expense/:expenceId", IsSuperOrAdmin, GetSinlgeExpences);

module.exports = expenceRouter;

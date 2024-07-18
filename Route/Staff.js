const express = require("express");
const { IsSuperOrAdmin } = require("../MiddleWare/isSuperOrAdmin");
const {
  CreateCategory,
  UpdateCategory,
  GetAllCategory,
  GetSingleCategory,
} = require("../Controller/Staff/Category");
const { body } = require("express-validator");

const StaffRouter = express.Router();

StaffRouter.post(
  "/create/staff/Categories",
  body("name").notEmpty().withMessage("name is required"),
  IsSuperOrAdmin,
  CreateCategory
);
StaffRouter.put(
  "/update/staff/Categories/:id",
  body("name").notEmpty().withMessage("name is required"),
  IsSuperOrAdmin,
  UpdateCategory
);
StaffRouter.get("/get/staff/Categories", IsSuperOrAdmin, GetAllCategory);
StaffRouter.get("/get/staff/Categories/:id", IsSuperOrAdmin, GetSingleCategory);




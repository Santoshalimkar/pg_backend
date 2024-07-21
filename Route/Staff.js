const express = require("express");
const { IsSuperOrAdmin } = require("../MiddleWare/isSuperOrAdmin");
const {
  CreateCategory,
  UpdateCategory,
  GetAllCategory,
  GetSingleCategory,
} = require("../Controller/Staff/Category");
const { body } = require("express-validator");
const {
  CreateStaff,
  UpdateStaff,
  getAllStaffBranch,
  getStaffdetails,
} = require("../Controller/Staff/Staff");

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

//--------------------Staff ------------------------------//
StaffRouter.post(
  "/create/staff",
  body("name").notEmpty().withMessage("name is required"),
  body("branch").notEmpty().withMessage("branch is required"),
  body("Number").notEmpty().withMessage("Number is required"),
  body("Category").notEmpty().withMessage("Category is required"),
  body("mothlysalary").notEmpty().withMessage("mothlysalary is required"),
  IsSuperOrAdmin,
  CreateStaff
);
StaffRouter.put(
  "/update/staff/:staffId",
  body("name").notEmpty().withMessage("name is required"),
  body("branch").notEmpty().withMessage("branch is required"),
  body("Number").notEmpty().withMessage("Number is required"),
  body("Category").notEmpty().withMessage("Category is required"),
  body("mothlysalary").notEmpty().withMessage("mothlysalary is required"),
  IsSuperOrAdmin,
  UpdateStaff
);
StaffRouter.get(
  "/get/staff/:branch",
  body("branch").notEmpty().withMessage("branch is required"),
  IsSuperOrAdmin,
  getAllStaffBranch
);
StaffRouter.get(
  "/getdetails/staff/:staffId",
  body("staffId").notEmpty().withMessage("staffId is required"),
  IsSuperOrAdmin,
  getStaffdetails
);
//--------------------salary------------------------------//

module.exports = StaffRouter;
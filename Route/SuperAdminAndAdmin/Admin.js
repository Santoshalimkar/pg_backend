const express = require("express");
const { IsSuperAdmin } = require("../../MiddleWare/IsSuperAdmin");
const { body } = require("express-validator");
const {
  CreateAdmin,
  UpdateAdmin,
  UpdateAdminBranch,
  ToggleActiveAdmin,
  GetAllAdmin,
  GetSingleAdmin,
  LoginAdmin,
} = require("../../Controller/SuperAdminAndAdmin/Admin");

const AdminRouter = express.Router();

//-------------Create Admin Route ---------------//
AdminRouter.post(
  "/create/admin",
  body("name").notEmpty().withMessage("Name is required"),
  body("Email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email must Be a Valied"),
  body("Number")
    .notEmpty()
    .withMessage("Number is required")
    .isLength({ min: 10, max: 10 })
    .withMessage("Numbe must be 10 digit"),
  body("Password").notEmpty().withMessage("Password is required"),
  body("branch").notEmpty().withMessage("Branch is required"),
  IsSuperAdmin,
  CreateAdmin
);

//-------------Update Admin Route ---------------//
AdminRouter.put(
  "/update/admin/:id",
  body("name").notEmpty().withMessage("Name is required"),
  body("Email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email must Be a Valied"),
  body("Number")
    .notEmpty()
    .withMessage("Number is required")
    .isLength({ min: 10, max: 10 })
    .withMessage("Numbe must be 10 digit"),
  body("Password").notEmpty().withMessage("Password is required"),
  body("branch").notEmpty().withMessage("Branch is required"),
  IsSuperAdmin,
  UpdateAdmin
);

//-------------Update Admin Route ---------------//
AdminRouter.put(
  "/update/branch/admin/:branchid/:adminid",
  IsSuperAdmin,
  UpdateAdminBranch
);

//-------------Update Active Toggle ---------------//
AdminRouter.put("/update/active/admin/:id", IsSuperAdmin, ToggleActiveAdmin);

//-------------Get All Admin ---------------//
AdminRouter.get("/get/admin/:branchid", IsSuperAdmin, GetAllAdmin);

//-------------Get All Admin ---------------//
AdminRouter.get("/getsingle/admin/:id", IsSuperAdmin, GetSingleAdmin);

//-------------Login Admin -----------------//
AdminRouter.post(
  "/login/Admin",
  body("Email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email must Be a Valied"),
  body("Password").notEmpty().withMessage("Password is required"),
  LoginAdmin
);

module.exports = {
  AdminRouter,
};

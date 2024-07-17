const express = require("express");
const {
  CreateSuperAdmin,
  GetSuperAdmin,
  GetSuperAdminID,
  UpdateSuperAdmin,
  LoginSuperAdmin,
  BlockSuperAdmin,
  UNBlockSuperAdmin,
} = require("../../Controller/SuperAdminAndAdmin/SuperAdmin");
const { body, param } = require("express-validator");

const SuperAdminRouter = express.Router();

//--------------Super Admin Create Route----------------------//
SuperAdminRouter.post(
  "/Create/SuperAdmin",
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
  CreateSuperAdmin
);

//--------------Super Admin GET Route----------------------//
SuperAdminRouter.get("/Get/SuperAdmin", GetSuperAdmin);

//--------------Super Admin GET BY ID Route----------------------//
SuperAdminRouter.get(
  "/Get/SuperAdmin/:id",
  param("id").notEmpty().withMessage("Super Admin Id is Required"),
  GetSuperAdminID
);

//--------------Super Admin UPDATE Route----------------------//
SuperAdminRouter.put(
  "/update/SuperAdmin/:id",
  param("id").notEmpty().withMessage("Super Admin Id is Required"),
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
  UpdateSuperAdmin
);

//-------------Login Super Admin --------------------//

SuperAdminRouter.post(
  "/login/SuperAdmin",
  body("Email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email must Be a Valied"),
  body("Password").notEmpty().withMessage("Password is required"),
  LoginSuperAdmin
);

//------------------Block Super Admin -----------------//

SuperAdminRouter.put("/block/SuperAdmin/:id", BlockSuperAdmin);

//------------------Block Super Admin -----------------//

SuperAdminRouter.put("/unblock/SuperAdmin/:id", UNBlockSuperAdmin);

module.exports = SuperAdminRouter;

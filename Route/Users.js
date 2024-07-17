const express = require("express");
const { IsSuperOrAdmin } = require("../MiddleWare/isSuperOrAdmin");
const {
  AddNewUserRoom,
  GetAllUserbyBranch,
  GetSingleUserbyBranch,
  GetUserbyStatus,
  UpdateUserRoom,
  ChangeRoom,
  UserLogin,
  GetOwnRoom,
} = require("../Controller/Users");
const { body } = require("express-validator");
const { isUser } = require("../MiddleWare/IsUser");

const UserRouter = express.Router();

UserRouter.post(
  "/create/user",
  body("UserName").notEmpty().withMessage("UserName is Required"),
  body("UserNumber").notEmpty().withMessage("UserNumber is Required"),
  body("StartDate").notEmpty().withMessage("StartDate is Required"),
  body("room").notEmpty().withMessage("Room Id is Required"),
  body("Amount").notEmpty().withMessage("Amount is Required"),
  body("NumberOfmonth").notEmpty().withMessage("NumberOfMonth is Required"),
  body("branch").notEmpty().withMessage("branch id is Required"),
  IsSuperOrAdmin,
  AddNewUserRoom
);

UserRouter.get("/get/user/:branchid", IsSuperOrAdmin, GetAllUserbyBranch);

UserRouter.get(
  "/get/user/:branchid/:userId",
  IsSuperOrAdmin,
  GetSingleUserbyBranch
);

UserRouter.get("/get/user", IsSuperOrAdmin, GetUserbyStatus);

UserRouter.put(
  "/update/user/:userId",
  body("UserName").notEmpty().withMessage("UserName is Required"),
  body("UserNumber").notEmpty().withMessage("UserNumber is Required"),
  body("StartDate").notEmpty().withMessage("StartDate is Required"),
  body("room").notEmpty().withMessage("Room Id is Required"),
  body("Amount").notEmpty().withMessage("Amount is Required"),
  body("NumberOfmonth").notEmpty().withMessage("NumberOfMonth is Required"),
  body("branch").notEmpty().withMessage("branch id is Required"),
  IsSuperOrAdmin,
  UpdateUserRoom
);

UserRouter.put(
  "/chageroom/user/:userId/:newRoomId",
  IsSuperOrAdmin,
  ChangeRoom
);

UserRouter.post(
  "/login/user",
  body("UserId").notEmpty().withMessage("UserId is Required"),
  body("UserNumber").notEmpty().withMessage("UserNumber is Required"),
  UserLogin
);

UserRouter.get("/profile/user", isUser, GetOwnRoom);

module.exports = UserRouter;

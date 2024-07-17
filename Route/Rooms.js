const express = require("express");
const {
  CreateRoom,
  UploadImage,
  GetAllRoom,
  GetSingleRoom,
  GetAllRoomByBranch,
  GetAllRoomByFloor,
  GetAllFloor,
  GetAllFloorbyBranch,
  UpdateRoom,
} = require("../Controller/Rooms");
const { upload } = require("../MiddleWare/fileUpload");
const { IsSuperOrAdmin } = require("../MiddleWare/isSuperOrAdmin");
const { body } = require("express-validator");

const RoomRouter = express.Router();

RoomRouter.post(
  "/add/room",
  body("roomName").notEmpty().withMessage("Room Name Is required"),
  body("RoomNumber").notEmpty().withMessage("Room Number Is required"),
  body("RoomType").notEmpty().withMessage("Room Type Is required"),
  body("branch").notEmpty().withMessage("Branch Is required"),
  body("floor").notEmpty().withMessage("Floor Is required"),
  IsSuperOrAdmin,
  CreateRoom
);

RoomRouter.put(
  "/upload/images/room/:roomid",
  upload.array("images"),
  UploadImage
);

RoomRouter.get("/all/room", IsSuperOrAdmin, GetAllRoom);
RoomRouter.get("/single/room/:roomid", IsSuperOrAdmin, GetSingleRoom);
RoomRouter.get("/branch/room/:branch", IsSuperOrAdmin, GetAllRoomByBranch);
RoomRouter.get("/floor/room/:floor", IsSuperOrAdmin, GetAllRoomByFloor);
RoomRouter.get("/allfloor/room", IsSuperOrAdmin, GetAllFloor);
RoomRouter.get("/allfloor/:branch", IsSuperOrAdmin, GetAllFloorbyBranch);

RoomRouter.patch(
  "/update/room/:roomid",
  body("roomName").notEmpty().withMessage("Room Name Is required"),
  body("RoomNumber").notEmpty().withMessage("Room Number Is required"),
  body("RoomType").notEmpty().withMessage("Room Type Is required"),
  body("branch").notEmpty().withMessage("Branch Is required"),
  body("floor").notEmpty().withMessage("Floor Is required"),
  IsSuperOrAdmin,
  UpdateRoom
);



module.exports = RoomRouter;

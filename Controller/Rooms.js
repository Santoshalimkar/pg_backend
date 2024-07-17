const cloudinary = require("cloudinary");
const { validationResult } = require("express-validator");
const AppErr = require("../Services/AppErr");
const RoomModel = require("../Model/Rooms");
const AdminModel = require("../Model/SuperAdminAndAdmin/Admin");
const BranchModel = require("../Model/SuperAdminAndAdmin/Branch");
const mongoose = require("mongoose");

//----------------Create Room -----------------------//

const CreateRoom = async (req, res, next) => {
  try {
    //-------Validation Check--------------//
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return next(new AppErr(result.errors[0].msg, 403));
    }

    let {
      roomName,
      RoomNumber,
      RoomType,
      SharingType,
      Price,
      Sharing,
      branch,
      floor,
    } = req.body;

    //---------Find Admin------------------//
    if (req.role === "admin") {
      let admin = await AdminModel.findById(req.user);
      if (!admin.branch.includes(branch)) {
        return next(new AppErr("You are not allowed to add room", 403));
      }
    }

    //---------Check Room Name----------//
    let room = await RoomModel.find({ roomName: roomName });
    if (room.length > 0) {
      return next(new AppErr("Room Name Already Used"));
    }

    //---------Check Room Number----------//
    let roomnumber = await RoomModel.find({ RoomNumber: RoomNumber });
    if (roomnumber.length > 0) {
      return next(new AppErr("Room Number Already Used"));
    }

    // Check if `branch` is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(branch)) {
      return next(new AppErr("Invalid Branch ID"), 400);
    }

    let branchcheck = await BranchModel.findById(branch);
    if (!branchcheck) {
      return next(new AppErr("Branch Not Found"), 404);
    }

    req.body.reaminingBed = SharingType;

    //------------Create Room -----------------//
    let newroom = await RoomModel.create(req.body);
    return res.status(200).json({
      status: true,
      statuscode: 200,
      message: "Room created successfully",
      data: newroom,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

//--------------------Upload Images for room --------------------//

const UploadImage = async (req, res, next) => {
  try {
    let { roomid } = req.params;

    //----------Check Room ---------------//

    const room = await RoomModel.findById(roomid);
    if (!room) {
      return next(new AppErr("Room not found", 404));
    }

    //---------------File Upload -----------------//
    const files = req.files;
    const images = await Promise.all(
      files.map(async (file) => {
        try {
          const result = await cloudinary.uploader.upload(file.path, {
            folder: "Pg",
          });
          return {
            url: result.url,
            secureUrl: result.secure_url,
            publicId: result.public_id,
            assetId: result.asset_id,
          };
        } catch (uploadError) {
          return { error: `Error uploading file: ${file.originalname}` };
        }
      })
    );
    room.images.push(images);
    await room.save();

    return res.status(200).json({
      status: true,
      statuscode: 200,
      message: "Images Uploaded successfully",
      data: room,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

//----------------Update Room -----------------------//

//----------------Get Room with Branch ---------------//
const GetAllRoomByBranch = async (req, res, next) => {
  try {
    let { branch } = req.params;
    let room = await RoomModel.find({ branch: branch })
    return res.status(200).json({
      status: true,
      statuscode: 200,
      message: "Fetched Room successfully",
      data: room,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

//----------------Get Room by Floor ------------------//
const GetAllRoomByFloor = async (req, res, next) => {
  try {
    let { floor } = req.params;
    let room = await RoomModel.find({ floor: floor });
    return res.status(200).json({
      status: true,
      statuscode: 200,
      message: "Fetched Room successfully",
      data: room,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

//-----------------Get All Room ----------------------//

const GetAllRoom = async (req, res, next) => {
  try {
    let room = await RoomModel.find();
    return res.status(200).json({
      status: true,
      statuscode: 200,
      message: "Fetched Room successfully",
      data: room,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};
//-----------------Get Single Room ------------------//
const GetSingleRoom = async (req, res, next) => {
  try {
    let { roomid } = req.params;
    let room = await RoomModel.findById(roomid);
    return res.status(200).json({
      status: true,
      statuscode: 200,
      message: "Fetched Room successfully",
      data: room,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

//-----------------Get All Floor----------------------//
const GetAllFloor = async (req, res, next) => {
  try {
    const uniqueFloors = await RoomModel.distinct("floor");
    res.status(200).json({
      status: true,
      statuscode: 200,
      message: "Fetched unique floors successfully",
      data: uniqueFloors,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

//-----------------Get All Floor----------------------//
const GetAllFloorbyBranch = async (req, res, next) => {
  try {
    const { branch } = req.params;

    // Validate if the branch ID is a valid ObjectId
    if (!branch || !mongoose.Types.ObjectId.isValid(branch)) {
      return next(new AppErr("Invalid or missing Branch ID"), 400);
    }

    // Find distinct floors for the given branch
    const uniqueFloors = await RoomModel.distinct("floor", { branch });

    res.status(200).json({
      status: true,
      statuscode: 200,
      message: "Fetched unique floors successfully",
      data: uniqueFloors,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

//----------------------Update Room ----------------------//

const UpdateRoom = async (req, res, next) => {
  try {
    //-------Validation Check--------------//
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return next(new AppErr(result.errors[0].msg, 403));
    }

    let { roomid } = req.params;
    if (!roomid) {
      return next(new AppErr("Room Id is required", 404));
    }

    let {
      roomName,
      RoomNumber,
      RoomType,
      SharingType,
      Price,
      Sharing,
      branch,
      floor,
    } = req.body;

    //---------Check Validation ----------------//
    let roomddeatsil = await RoomModel.findById(roomid);
    if (SharingType >= roomddeatsil.Users.length) {
      req.body.reaminingBed = SharingType;
    } else if (SharingType < roomddeatsil.Users.length) {
      return next(
        new AppErr(
          `In current Room Already ${roomddeatsil.Users.length} members are staying So that Sharing Type will not be less than Current members! in Case if Member left or leave Pg or Room. Reomve that member from Room`,
          403
        )
      );
    }

    //---------Find Admin------------------//
    if (req.role === "admin") {
      let admin = await AdminModel.findById(req.user);
      if (!admin.branch.includes(branch)) {
        return next(new AppErr("You are not allowed to add room", 403));
      }
    }

    //---------Check Room Name----------//
    let room = await RoomModel.find({
      roomName: roomName,
      _id: { $ne: roomid },
    });
    if (room.length > 0) {
      return next(new AppErr("Room Name Already Used"));
    }

    //---------Check Room Number----------//
    let roomnumber = await RoomModel.find({
      RoomNumber: RoomNumber,
      _id: { $ne: roomid },
    });
    if (roomnumber.length > 0) {
      return next(new AppErr("Room Number Already Used"));
    }

    // Check if `branch` is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(branch)) {
      return next(new AppErr("Invalid Branch ID"), 400);
    }

    let branchcheck = await BranchModel.findById(branch);
    if (!branchcheck) {
      return next(new AppErr("Branch Not Found"), 404);
    }

    //------------Create Room -----------------//
    let newroom = await RoomModel.findByIdAndUpdate(roomid, req.body, {
      new: true,
    });
    return res.status(200).json({
      status: true,
      statuscode: 200,
      message: "Room Updated successfully",
      data: newroom,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

module.exports = {
  CreateRoom,
  UploadImage,
  GetAllRoom,
  GetSingleRoom,
  GetAllRoomByBranch,
  GetAllRoomByFloor,
  GetAllFloor,
  GetAllFloorbyBranch,
  UpdateRoom,
};

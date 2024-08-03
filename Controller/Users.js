const { validationResult } = require("express-validator");
const PaymentModel = require("../Model/Payment");
const RoomModel = require("../Model/Rooms");
const addMonth = require("../Services/addmonth");
const AppErr = require("../Services/AppErr");
const AdminModel = require("../Model/SuperAdminAndAdmin/Admin");
const UserModel = require("../Model/User");
const BranchModel = require("../Model/SuperAdminAndAdmin/Branch");
const GenerateToken = require("../Services/Jwt/GenerteToken");

//----------Add New User to Room -------------//
const AddNewUserRoom = async (req, res, next) => {
  try {
    //-------Validation Check--------------//
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return next(new AppErr(result.errors[0].msg, 403));
    }
    let {
      UserName,
      UserNumber,
      StartDate,
      room,
      Amount,
      Maintaince,
      Security,
      DueAmount,
      NumberOfmonth,
      branch,
      AadharNumber,
      Address,
      Email,
      LastDate
    } = req.body;

    //--------------Check UserNumber -------------//
    let user = await UserModel.find({ UserNumber: UserNumber });
    if (user.length > 0) {
      return next(new AppErr("User Number Already In User", 403));
    }

    //------------Check Room -----------//
    let rooms = await RoomModel.findById(room);
    if (!rooms) {
      next(new AppErr("Rooms not found", 404));
    }

    //-----------Check Remaining Bed -----------//
    if (rooms.reaminingBed === 0 || rooms.reaminingBed < 0) {
      next(new AppErr("Not Empty Bed", 403));
    }

    //---------Find Admin------------------//
    if (req.role === "admin") {
      let admin = await AdminModel.findById(req.user);
      if (!admin.branch.includes(rooms.branch)) {
        return next(
          new AppErr(
            `You Don't have access for Other ${rooms.branch}  Branch`,
            403
          )
        );
      }
    }
    req.body.UserId = UserName.slice(0, 2) + "/" + UserNumber;
    req.body.BookedDate = new Date();
    // req.body.LastDate = addMonth(StartDate, NumberOfmonth);

    if (DueAmount > 0) {
      req.body.Status = "Due";
    } else {
      req.body.Status = "Paid";
    }

    //---------------Create Payment------------------//
    let payment = await PaymentModel({
      UserId: UserName.slice(0, 2) + "/" + UserNumber,
      Amount: Amount,
      Maintaince: Maintaince,
      Security: Security,
      DueAmount: DueAmount,
      NumberOfmonth: NumberOfmonth,
      PayemntDate: new Date(),
      // LastDueDate: addMonth(StartDate, NumberOfmonth),
      LastDueDate: LastDate,
      branch: branch,
    });
    payment = await payment.save();

    // Ensure req.body.room is an array
    if (!Array.isArray(req.body.room)) {
      req.body.room = [];
    }
    req.body.room.push(rooms._id);

    // Ensure req.body.Payment is an array
    if (!Array.isArray(req.body.Payment)) {
      req.body.Payment = [];
    }
    req.body.Payment.push(payment._id);

    //------------------Create User-------------------//
    let newuser = await UserModel.create(req.body);
    rooms.Users.push(newuser._id);
    rooms.reaminingBed = rooms.reaminingBed - 1;
    await rooms.save();

    return res.status(200).json({
      status: true,
      statuscode: 200,
      message: "User created successfully",
      data: newuser,
      payment: payment,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

//-------------Get All User of Branch------------------//

const GetAllUserbyBranch = async (req, res, next) => {
  try {
    let { branchid } = req.params;

    if (!branchid) {
      return next(new AppErr("BranchId is required", 403));
    }
    let branch = await BranchModel.findById(branchid);

    if (!branch) {
      return next(new AppErr("Branch not found", 404));
    }

    let user = await UserModel.find({ branch: branchid, leftroom: false })
      .populate("room")
      .populate("Payment")
      .populate("branch");

    return res.status(200).json({
      status: true,
      statuscode: 200,
      message: "User Fetched successfully",
      data: user,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

//------Get SingleUserDeatils ---------------//

const GetSingleUserbyBranch = async (req, res, next) => {
  try {
    let { userId } = req.params;

    let user = await UserModel.findById(userId)
      // .populate("room")
      .populate("Payment")
      .populate("branch");

    return res.status(200).json({
      status: true,
      statuscode: 200,
      message: "User Fetched successfully",
      data: user,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};
//-----------Get Users Based on Paid And Pending Status ----------//

const GetUserbyStatus = async (req, res, next) => {
  try {
    let { status } = req.query;
    let user = await UserModel.find({ Status: status, leftroom: false })
      .populate("room")
      .populate("Payment")
      .populate("branch");

    return res.status(200).json({
      status: true,
      statuscode: 200,
      message: "User Fetched successfully",
      data: user,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};
//-----------------------Update User-----------------------//
const UpdateUserRoom = async (req, res, next) => {
  try {
    //-------Validation Check--------------//
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return next(new AppErr(result.errors[0].msg, 403));
    }
    let {
      UserName,
      UserNumber,
      StartDate,
      room,
      Amount,
      Maintaince,
      Security,
      DueAmount,
      NumberOfmonth,
      branch,
      AadharNumber,
      Address,
      Email,
      LastDate
    } = req.body;

    //--------------Check User-------------//
    let user = await UserModel.findById(req.params.userId);
    if (!user) {
      return next(new AppErr("User not found", 404));
    }

    //------------Check Room -----------//
    let rooms = await RoomModel.findById(room);
    if (!rooms) {
      return next(new AppErr("Rooms not found", 404));
    }

    //---------Find Admin------------------//
    if (req.role === "admin") {
      let admin = await AdminModel.findById(req.user);
      if (!admin.branch.includes(rooms.branch)) {
        return next(
          new AppErr(
            `You Don't have access for Other ${rooms.branch} Branch`,
            403
          )
        );
      }
    }

    user.UserId = UserName.slice(0, 2) + "/" + UserNumber;
    // user.LastDate = addMonth(StartDate, NumberOfmonth);
    user.LastDate = LastDate
    user.Status = DueAmount > 0 ? "Due" : "Paid";
    user.UserName = UserName;
    user.UserNumber = UserNumber;
    user.StartDate = StartDate;
    user.DueAmount = DueAmount;
    user.NumberOfmonth = NumberOfmonth;
    user.room = [rooms._id];

    let userold = await UserModel.findById(req.params.userId);
    console.log(user);
    if (user?.Payment?.length > 1) {
      let payment = await PaymentModel.updateMany(
        { UserId: userold.UserId },
        {
          UserId: user.UserId,
        },
        { new: true }
      );
    } else {
      let payment = await PaymentModel.findById(user.Payment[0]);
      if (!payment) {
        return next(new AppErr("Payment not found", 404));
      }
      payment.UserId = user.UserId;
      payment.Amount = Amount;
      payment.Maintaince = Maintaince;
      payment.Security = Security;
      payment.DueAmount = DueAmount;
      payment.NumberOfmonth = NumberOfmonth;
      payment.LastDueDate = LastDate
      payment.branch = branch;
      await payment.save();
    }

    let olduser = await UserModel.findById(req.params.userId);
    let oldRoom = await RoomModel.findById(olduser.room[0]);


    if (oldRoom._id.toString() !== rooms._id.toString()) {
      oldRoom.Users = oldRoom.Users.filter(
        (u) => u.toString() !== user._id.toString()
      );
      oldRoom.reaminingBed += 1;
      await oldRoom.save();
      if (!rooms.Users.includes(user._id)) {
        rooms.Users.push(user._id);
      }
      rooms.reaminingBed -= 1;
      user.room = [];
      user.room.push(rooms._id);
    }
    await rooms.save();
    await user.save();

    return res.status(200).json({
      status: true,
      statuscode: 200,
      message: "User updated successfully",
      data: user,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

//--------------------Change Rooms -----------------------//

const ChangeRoom = async (req, res, next) => {
  try {
    let { userId, newRoomId } = req.params;

    //------------GetUser------------//
    let user = await UserModel.findById(userId);
    if (!user) {
      return next(new AppErr("user not found", 404));
    }

    //------------new room --------------//
    let rooms = await RoomModel.findById(newRoomId);
    if (!rooms) {
      return next(new AppErr("New Room not found", 404));
    }

    //---------Check Bed------------//
    if (rooms.reaminingBed === 0 || rooms.reaminingBed < 0) {
      return next(new AppErr("No Empty Bed"), 404);
    }

    //------------Old room -------------//
    let oldRoom = await RoomModel.findById(user.room[0]);

    if (oldRoom._id.toString() !== rooms._id.toString()) {
      oldRoom.Users = oldRoom.Users.filter(
        (u) => u.toString() !== user._id.toString()
      );
      oldRoom.reaminingBed += 1;
      await oldRoom.save();
      if (!rooms.Users.includes(user._id)) {
        rooms.Users.push(user._id);
      }
      rooms.reaminingBed -= 1;
      user.room = [];
      user.room.push(rooms._id);
    }
    await rooms.save();
    await user.save();

    return res.status(200).json({
      status: true,
      statuscode: 200,
      message: "Room Changed successfully",
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

//--------------------Login Users ------------------------//

const UserLogin = async (req, res, next) => {
  try {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return next(new AppErr(result.errors[0].msg, 403));
    }
    let { UserId, UserNumber } = req.body;

    let user = await UserModel.findOne({
      UserId: UserId,
      UserNumber: UserNumber,
      leftroom: false
    });
    if (!user) {
      return next(new AppErr("Wrong UserId or UserNumber", 404));
    }
    const payload = { id: user._id };
    let token = GenerateToken(payload);

    return res.status(200).json({
      status: true,
      statuscode: 200,
      message: "User Loged in successfully",
      token: token,
      user: user,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

//--------------Get Own Room Complete Deatils -----------------------------//

const GetOwnRoom = async (req, res, next) => {
  try {
    let user = await UserModel.findById(req.user)
      .populate("room")
      .populate("Payment")
      .populate("branch");

    return res.status(200).json({
      status: true,
      statuscode: 200,
      message: "User Data fetched successfully",
      data: user,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

//--------------Remove user From Room--------------------//

const removeuserfromRoom = async (req, res, next) => {
  try {
    let { userId } = req.params;

    if (!userId) {
      return next(new AppErr("userId is required", 403));
    }

    // Find the user by ID
    let user = await UserModel.findById(userId);
    if (!user) {
      return next(new AppErr("User not found", 404));
    }

    // Find the room that contains the user
    let room = await RoomModel.findOne({ Users: { $in: [userId] } });
    if (!room) {
      return next(new AppErr("Room not found", 404));
    }

    // Remove the user from the room's Users array
    room.Users = room.Users.filter(userIdInRoom => userIdInRoom.toString() !== userId);

    // Update the remaining beds count
    room.reaminingBed += 1;

    // Save the updated room document
    await room.save();

    // Update the user's room status
    user.room = [];
    user.leftroom = true;

    // Save the updated user document
    await user.save();

    return res.status(200).json({
      status: true,
      statuscode: 200,
      message: "User removed from room",
      data: user,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

module.exports = {
  AddNewUserRoom,
  GetAllUserbyBranch,
  GetSingleUserbyBranch,
  GetUserbyStatus,
  UpdateUserRoom,
  ChangeRoom,
  UserLogin,
  GetOwnRoom,
  removeuserfromRoom,
};

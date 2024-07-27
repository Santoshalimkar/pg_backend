const { validationResult } = require("express-validator");
const AppErr = require("../Services/AppErr");
const UserModel = require("../Model/User");
const {
  getMonthDayDifference,
  calculateRent,
} = require("../Services/PaymnetCal");
const RoomModel = require("../Model/Rooms");
const PaymentModel = require("../Model/Payment");
const { request } = require("express");

//--------------Create Payment --------------------//
const CreatePayment = async (req, res, next) => {
  try {
    //-------Validation Check--------------//
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return next(new AppErr(result.errors[0].msg, 403));
    }
    let { UserId, Amount, NumberOfmonth, LastDueDate, branch } = req.body;
    //------ Get UserId -------------//
    let user = await UserModel.findOne({ UserId: UserId });
    if (!user) {
      return next(new AppErr("user not found", 404));
    }
    //---------Get Room--------------//
    let room = await RoomModel.findById(user.room[0]);
    if (!room) {
      return next(new AppErr("room not found", 404));
    }
    //----------Check User Belong to that room or not------------//
    if (!room.Users.includes(user._id)) {
      return next(new AppErr("User not present in room", 403));
    }
    req.body.user = user._id;
    if (user.DueAmount > Amount) {
      user.DueAmount = user.DueAmount - Amount;
      req.body.DueAmount = user.DueAmount - Amount;
      req.body.LastDueDate = LastDueDate;
      user.LastDate = LastDueDate;
      user.Status = "Due";
      req.body.PayemntDate = new Date();
    } else {
      user.DueAmount = 0;
      req.body.DueAmount = 0;
      req.body.LastDueDate = LastDueDate;
      user.LastDate = LastDueDate;
      user.Status = "Paid";
      req.body.PayemntDate = new Date();
    }
    let newpayment = await PaymentModel.create(req.body);
    user.Payment.push(newpayment._id);
    await user.save();

    return res.status(200).json({
      status: true,
      statuscode: 200,
      message: "Payment created successfully",
      data: newpayment,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

const CalculateRent = async (req, res, next) => {
  try {
    let { UserId, lastdate } = req.body;
    //------ Get UserId -------------//
    let user = await UserModel.findOne({ UserId: UserId });
    if (!user) {
      return next(new AppErr("user not found", 404));
    }
    //---------Get Room--------------//
    let room = await RoomModel.findById(user.room[0]);
    if (!room) {
      return next(new AppErr("room not found", 404));
    }
    //----------Check User Belong to that room or not------------//
    if (!room.Users.includes(user._id)) {
      return next(new AppErr("User not present in room", 403));
    }

    //------------Check User Due Amount ----------------//
    let { months, days } = getMonthDayDifference(user.LastDate, lastdate);
    let totalrent = calculateRent(room.Price, months, days, user.DueAmount);
    console.log(months, days);
    return res.status(200).json({
      status: true,
      statuscode: 200,
      message: "Total Rent",
      data: totalrent,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

//-------------Update Payment -------------------//
const UpdatePayment = async (req, res, next) => {
  try {
    //-------Validation Check--------------//
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return next(new AppErr(result.errors[0].msg, 403));
    }
    let { UserId, Amount, NumberOfmonth, LastDueDate, branch } = req.body;

    let { paymentId } = req.params;
    //------ Get UserId -------------//
    let user = await UserModel.findOne({ UserId: UserId });
    if (!user) {
      return next(new AppErr("user not found", 404));
    }
    //---------Get Room--------------//
    let room = await RoomModel.findById(user.room[0]);
    if (!room) {
      return next(new AppErr("room not found", 404));
    }
    //----------Check User Belong to that room or not------------//
    if (!room.Users.includes(user._id)) {
      return next(new AppErr("User not present in room", 403));
    }
    req.body.user = user._id;
    if (user.DueAmount > Amount) {
      user.DueAmount = user.DueAmount - Amount;
      req.body.DueAmount = user.DueAmount - Amount;
      req.body.LastDueDate = LastDueDate;
      user.LastDate = LastDueDate;
      user.Status = "Due";
      req.body.PayemntDate = new Date();
    } else {
      user.DueAmount = 0;
      req.body.DueAmount = 0;
      req.body.LastDueDate = LastDueDate;
      user.LastDate = LastDueDate;
      user.Status = "Paid";
      req.body.PayemntDate = new Date();
    }
    let newpayment = await PaymentModel.findByIdAndUpdate(paymentId, req.body, {
      new: true,
    });
    await user.save();

    return res.status(200).json({
      status: true,
      statuscode: 200,
      message: "Payment Updated successfully",
      data: newpayment,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

//-------------Get All Payment of Branch --------//
const GetAllPaymentOfBranch = async (req, res, next) => {
  try {
    let { branchId } = req.params;
    if (!branchId) {
      return next(new AppErr("BranchId is required", 404));
    }
    let payment = await PaymentModel.find({
      branch: { $in: [branchId] },
    })
      .populate("user")
      .populate({
        path: "user",
        populate: { path: "room", path: "branch" },
      });

    return res.status(200).json({
      status: true,
      statuscode: 200,
      message: "Payment Fetched successfully",
      data: payment,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

module.exports = {
  CreatePayment,
  CalculateRent,
  UpdatePayment,
  GetAllPaymentOfBranch,
};

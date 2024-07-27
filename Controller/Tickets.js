const { validationResult } = require("express-validator");
const AppErr = require("../Services/AppErr");
const UserModel = require("../Model/User");
const BranchModel = require("../Model/SuperAdminAndAdmin/Branch");
const Tickemodel = require("../Model/Tickets");

//---------------Create Tickets --------------------//
const CreateTicket = async (req, res, next) => {
  try {
    //-------Validation Check--------------//
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return next(new AppErr(result.errors[0].msg, 403));
    }
    let { TicketName, TicketDescription, Categoery, branch } = req.body;

    //----Check User------//
    let user = await UserModel.findById(req.user);
    if (!user) {
      return next(new AppErr("User not found", 404));
    }
    req.body.userId = user._id;
    req.body.status = "pending";
    req.body.ticketId = Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;
    //------Check Branch-----------//
    let branchfound = await BranchModel.findById(branch);
    console.log(branchfound);
    if (!branchfound) {
      return next(new AppErr("Branch not found", 404));
    }

    //-----------Create Ticket --------------//
    let ticket = await Tickemodel.create(req.body);

    return res.status(200).json({
      status: true,
      statuscode: 200,
      message: "Ticket created successfully",
      data: ticket,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};
//--------------Get my tickets -------------------//
const GetAllMyTicket = async (req, res, next) => {
  try {
    let ticket = await Tickemodel.find({ userId: req.user });
    return res.status(200).json({
      status: true,
      statuscode: 200,
      message: "Ticket Fetched successfully",
      data: ticket,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

//--------------Get tickets by branch ----------------//
const GetTicketbybranch = async (req, res, next) => {
  try {
    let { branchId } = req.params;
    if (!branchId) {
      return next(new AppErr("Branch Id is required", 403));
    }
    let ticket = await Tickemodel.find({ branch: branchId }).populate("userId");
    return res.status(200).json({
      status: true,
      statuscode: 200,
      message: "Ticket Fetched successfully",
      data: ticket,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

//--------------Get Tickets by status ----------------//
const GetTicketbystatus = async (req, res, next) => {
  try {
    let { status } = req.params;
    const definedStatus = ["pending", "resolved", "closed"];
    if (!status) {
      return next(new AppErr("status is required", 403));
    }
    if (!definedStatus.includes(status)) {
      return next(new AppErr("status can be pending, resolved, closed", 403));
    }
    let ticket = await Tickemodel.find({ status: status }).populate("userId");
    return res.status(200).json({
      status: true,
      statuscode: 200,
      message: "Ticket Fetched successfully",
      data: ticket,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

//---------------Resolve Ticket-----------//
const ResolveTicket = async (req, res, next) => {
  try {
    let { ticketId } = req.params;
    let { remark } = req.body;
    const update = {
      $set: {
        status: "resolved",
        remark: remark,
      },
    };
    const result = await Tickemodel.updateOne({ _id: ticketId }, update);
    return res.status(200).json({
      status: true,
      statuscode: 200,
      message: "Ticket Resolved successfully",
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

//--------------Close Ticket-------------//

const CloseTicket = async (req, res, next) => {
  try {
    let { ticketId } = req.params;
    const update = {
      $set: {
        status: "closed",
      },
    };
    const result = await Tickemodel.updateOne({ _id: ticketId }, update);
    return res.status(200).json({
      status: true,
      statuscode: 200,
      message: "Ticket Closed successfully",
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

module.exports = {
  CreateTicket,
  GetAllMyTicket,
  GetTicketbybranch,
  GetTicketbystatus,
  ResolveTicket,
  CloseTicket,
};

const { validationResult } = require("express-validator");
const AppErr = require("../../Services/AppErr");
const Methods = require("../../Services/GlobalMethod/Method");
const BranchModel = require("../../Model/SuperAdminAndAdmin/Branch");
const UserModel = require("../../Model/User");
const AdminModel = require("../../Model/SuperAdminAndAdmin/Admin");

const Api = new Methods();

//-----------------------Create a new Branch--------------------------------//

const CreateBranch = async (req, res, next) => {
  try {
    //--------Validation Check--------------//
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return next(new AppErr(result.errors[0].msg, 403));
    }
    let { Branchname, code, Address, Number } = req.body;
    //----------Create Branch--------------//
    let response = await Api.create(BranchModel, req.body);
    if (response.status === 200) {
      return res.status(200).json({
        status: true,
        statuscode: 200,
        message: "Branch Created successfully",
        data: response,
      });
    } else {
      return res.status(400).json({
        status: false,
        statuscode: 400,
        message: response,
      });
    }
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

//-----------------Update Branch--------------//

const UpdateBranch = async (req, res, next) => {
  try {
    //--------Validation Check--------------//
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return next(new AppErr(result.errors[0].msg, 403));
    }
    let { Branchname, code, Address, Number } = req.body;
    let { id } = req.params;

    //---------Check Branch ------------//
    let branch = await BranchModel.findById(id);
    if (!branch) {
      next(new AppErr("Branch Not Found", 404));
    }
    //----------Create Branch--------------//
    let response = await Api.update(BranchModel, id, req.body);
    if (response.status === 200) {
      return res.status(200).json({
        status: true,
        statuscode: 200,
        message: "Branch Updated successfully",
        data: response,
      });
    } else {
      return res.status(400).json({
        status: false,
        statuscode: 400,
        message: response,
      });
    }
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

//----------------GET All Branch -----------------//

const GetAllBranch = async (req, res, next) => {
  try {
    let branch = await BranchModel.find();
    return res.status(200).json({
      status: true,
      statuscode: 200,
      message: "Branch fetched successfully",
      data: branch,
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

//----------------GET Single Branch -----------------//

const GetSingleBranch = async (req, res, next) => {
  try {
    let { id } = req.params;
    let branch = await BranchModel.findById(id);
    return res.status(200).json({
      status: true,
      statuscode: 200,
      message: "Branch fetched successfully",
      data: branch,
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

//------------------Create Total Admin and Teants---------------------------//

const totaladminandteants = async (req, res, next) => {
  try {
    let { branchId } = req.params;

    let branch = await BranchModel.findById(branchId);
    if (!branch) {
      return next(new AppErr("branch not found", 404));
    }

    let admins = await AdminModel.find();
    let admincount = admins.filter((admin) => admin.branch.includes(branchId));
    let user = await UserModel.find();
    let usercount = user.filter((user) => user.branch.includes(branchId));


    return res.status(200).json({
      status: true,
      statuscode: 200,
      message: "Branch details fetched successfully",
      data: {
        admins: admincount?.length,
        user: usercount?.length,
      },
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

module.exports = {
  CreateBranch,
  UpdateBranch,
  GetAllBranch,
  GetSingleBranch,
  totaladminandteants,
};

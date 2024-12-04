const { validationResult } = require("express-validator");
const AdminModel = require("../../Model/SuperAdminAndAdmin/Admin");
const AppErr = require("../../Services/AppErr");
const Methods = require("../../Services/GlobalMethod/Method");
const BranchModel = require("../../Model/SuperAdminAndAdmin/Branch");
const GenerateToken = require("../../Services/Jwt/GenerteToken");

const Api = new Methods();

//-------------------------Create Admin ------------------------//
const CreateAdmin = async (req, res, next) => {
  try {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return next(new AppErr(result.errors[0].msg, 403));
    }

    let { name, Email, Number, Password, branch } = req.body;

    let EmailFound = await AdminModel.find({ Email: Email });
    if (EmailFound.length > 0) {
      return next(new AppErr("Email Already Exists", 402));
    }

    let NumberFound = await AdminModel.find({ Number: Number });
    if (NumberFound.length > 0) {
      return next(new AppErr("Number Already Exists", 402));
    }

    req.body.Password = Password; // Store plain text password (insecure)
    req.body.activate = true;

    let branchData = await BranchModel.findById(branch);
    if (!branchData) {
      return next(new AppErr("Branch Not Found", 404));
    }

    if (!Array.isArray(req.body.branch)) {
      req.body.branch = [];
    }
    req.body.branch.push(branchData._id);

    try {
      const response = await Api.create(AdminModel, req.body);
      if (response.status === 200) {
        return res.status(200).json({
          status: true,
          statuscode: 200,
          message: "Admin Created successfully",
          data: response,
        });
      } else {
        return res.status(400).json({
          status: false,
          statuscode: 400,
          message: response,
        });
      }
    } catch (err) {
      return res.status(400).json({
        status: false,
        statuscode: 400,
        message: err.message,
      });
    }
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

//-------------------------Update Admin ------------------------//
const UpdateAdmin = async (req, res, next) => {
  try {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return next(new AppErr(result.errors[0].msg, 403));
    }
    let { id } = req.params;
    let { name, Email, Number, Password, branch } = req.body;

    let EmailFound = await AdminModel.find({ Email: Email, _id: { $ne: id } });
    if (EmailFound.length > 0) {
      return next(new AppErr("Email Already Exists", 402));
    }

    let NumberFound = await AdminModel.find({
      Number: Number,
      _id: { $ne: id },
    });
    if (NumberFound.length > 0) {
      return next(new AppErr("Number Already Exists", 402));
    }

    req.body.Password = Password;

    let branchData = await BranchModel.findById(branch);
    if (!branchData) {
      return next(new AppErr("Branch Not Found", 404));
    }

    if (!Array.isArray(req.body.branch)) {
      req.body.branch = [];
    }
    req.body.branch.push(branchData._id);

    try {
      const response = await Api.update(AdminModel, id, req.body);
      if (response.status === 200) {
        return res.status(200).json({
          status: true,
          statuscode: 200,
          message: "Admin Updated successfully",
          data: response,
        });
      } else {
        return res.status(400).json({
          status: false,
          statuscode: 400,
          message: response,
        });
      }
    } catch (err) {
      return res.status(400).json({
        status: false,
        statuscode: 400,
        message: err.message,
      });
    }
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

//-------------------------Login Admin ------------------------//
const LoginAdmin = async (req, res, next) => {
  try {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return next(new AppErr(result.errors[0].msg, 403));
    }
    let { Email, Password } = req.body;

    let admin = await AdminModel.findOne({ Email: Email });
    if (!admin) {
      return next(new AppErr("Admin not found", 404));
    }

    if (!admin.activate) {
      return next(new AppErr("Admin not activated! talk to super Admin", 404));
    }

    if (Password !== admin.Password) {
      return next(new AppErr("Invalid Password", 404));
    }

    const payload = { id: admin._id };
    const token = GenerateToken(payload);

    return res.status(200).json({
      status: true,
      statuscode: 200,
      message: "Login successful",
      data: admin,
      token: token,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

//-------------------------Update Admin Branch ------------------------//
const UpdateAdminBranch = async (req, res, next) => {
  try {
    let { branchid, adminid } = req.params;

    let admin = await AdminModel.findById(adminid);
    if (!admin) {
      return next(new AppErr("Admin not found", 404));
    }

    if (!admin.activate) {
      return next(new AppErr("Admin is not activated", 404));
    }

    let branch = await BranchModel.findById(branchid);
    if (!branch) {
      return next(new AppErr("Branch not found", 404));
    }

    admin.branch = [];
    admin.branch.push(branchid);
    await admin.save();

    return res.status(200).json({
      status: true,
      statuscode: 200,
      message: "Branch Updated successfully",
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

//-------------------------Toggle Active Admin ------------------------//
const ToggleActiveAdmin = async (req, res, next) => {
  try {
    let { id } = req.params;

    let admin = await AdminModel.findById(id);
    if (!admin) {
      return next(new AppErr("Admin not found", 404));
    }

    admin.activate = !admin.activate;
    await admin.save();

    return res.status(200).json({
      status: true,
      statuscode: 200,
      message: "Admin successfully activated/deactivated",
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

//-------------------------Get All Admins ------------------------//
const GetAllAdmin = async (req, res, next) => {
  try {
    let { branchid } = req.params;
    let admin = await AdminModel.find();
    let filterdata = admin.filter((branch) => branch.branch.includes(branchid));
    return res.status(200).json({
      status: true,
      statuscode: 200,
      message: "Admin fetched successfully",
      data: filterdata,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

//-------------------------Get Single Admin ------------------------//
const GetSingleAdmin = async (req, res, next) => {
  try {
    let { id } = req.params;
    let admin = await AdminModel.findById(id);
    return res.status(200).json({
      status: true,
      statuscode: 200,
      message: "Admin fetched successfully",
      data: admin,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

module.exports = {
  CreateAdmin,
  UpdateAdmin,
  LoginAdmin,
  UpdateAdminBranch,
  ToggleActiveAdmin,
  GetAllAdmin,
  GetSingleAdmin,
};

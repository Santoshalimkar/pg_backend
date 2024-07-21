const { validationResult } = require("express-validator");
const CategoryModel = require("../../Model/Staff/Category");
const StaffModel = require("../../Model/Staff/Staff");
const BranchModel = require("../../Model/SuperAdminAndAdmin/Branch");
const AppErr = require("../../Services/AppErr");

//------------Create Staff ------------------//
const CreateStaff = async (req, res, next) => {
  try {
    //---Validation Check ------//
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return next(new AppErr(result.errors[0].msg, 403));
    }
    //----------------Take Data ------------//
    let { name, branch, Number, Category, mothlysalary } = req.body;

    //--------Check Branch -------------//
    let branchfound = await BranchModel.findById(branch);
    if (!branchfound) {
      return next(new AppErr("Branch Not Found", 404));
    }
    //-------Check Category------------//
    let Categoryfound = await CategoryModel.findById(Category);
    if (!Categoryfound) {
      return next(new AppErr("Category Not Found", 404));
    }

    //------Create Staff --------------//
    let staff = await StaffModel.create(req.body);
    Categoryfound.Staff.push(staff._id);
    await Categoryfound.save();

    return res.status(200).json({
      status: true,
      statuscode: 200,
      message: "Staff created successfully",
      data: staff,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

//------------Update Staff ------------------//
const UpdateStaff = async (req, res, next) => {
  try {
    //---Validation Check ------//
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return next(new AppErr(result.errors[0].msg, 403));
    }
    //----------------Take Data ------------//
    let { name, branch, Number, Category, mothlysalary } = req.body;
    let { staffId } = req.params;

    //-----------Find Old Staff -------------//
    let oldStaff = await StaffModel.findById(staffId);
    if (!oldStaff) {
      return next(new AppErr("Staff not found", 404));
    }

    //--------Check Branch -------------//
    let branchfound = await BranchModel.findById(branch);
    if (!branchfound) {
      return next(new AppErr("Branch Not Found", 404));
    }
    //-------Check Category------------//
    let Categoryfound = await CategoryModel.findById(Category);
    if (!Categoryfound) {
      return next(new AppErr("Category Not Found", 404));
    }

    //------Create Staff --------------//
    let staff = await StaffModel.findByIdAndUpdate(staffId, req.body, {
      new: true,
    });
    if (!Categoryfound.Staff.includes(staff._id)) {
      Categoryfound.Staff.filter((item) => item !== oldStaff._id);
      Categoryfound.Staff.push(staff._id);
    }
    await Categoryfound.save();

    return res.status(200).json({
      status: true,
      statuscode: 200,
      message: "Staff Updated successfully",
      data: staff,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

const getAllStaffBranch = async (req, res, next) => {
  try {
    let { branch } = req.params;
    let staff = await StaffModel.find({ branch: branch });

    return res.status(200).json({
      status: true,
      statuscode: 200,
      message: "Staff Fetched successfully",
      data: staff,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

const getStaffdetails = async (req, res, next) => {
  try {
    let { staffId } = req.params;

    let staff = await StaffModel.findById(staffId).populate("Category");

    return res.status(200).json({
      status: true,
      statuscode: 200,
      message: "Staff Fetched successfully",
      data: staff,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

module.exports = {
  CreateStaff,
  UpdateStaff,
  getAllStaffBranch,
  getStaffdetails,
};

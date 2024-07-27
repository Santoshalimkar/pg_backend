const { validationResult } = require("express-validator");
const AppErr = require("../../Services/AppErr");
const StaffModel = require("../../Model/Staff/Staff");
const SalaryModel = require("../../Model/Staff/Salary");

//-----------------Create Salary-----------------------//
const CreateSalary = async (req, res, next) => {
  try {
    //---Validation Check ------//
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return next(new AppErr(result.errors[0].msg, 403));
    }
    //--------------Take data---------------//
    let { staff, Amount, salarymonth } = req.body;

    //---------Find Staff--------------//
    let staffFound = await StaffModel.findById(staff);
    if (!staffFound) {
      return next(new AppErr("Staff not found", 404));
    }

    let salary = await SalaryModel.create(req.body);
    staffFound.Salary.push(salary._id);
    staffFound.salarypaidmonth = salarymonth;

    await staffFound.save();

    return res.status(200).json({
      status: true,
      statuscode: 200,
      message: "Salary created successfully",
      data: salary,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

//-----------------Create Salary-----------------------//
const UpdateSalary = async (req, res, next) => {
  try {
    //---Validation Check ------//
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return next(new AppErr(result.errors[0].msg, 403));
    }
    //--------------Take data---------------//
    let { staff, Amount, salarymonth } = req.body;
    let { salaryId } = req.params;

    //-----------check---------//
    let oldsal = await SalaryModel.findById(salaryId);
    if (!oldsal) {
      return next(new AppErr("salary not found", 404));
    }

    //---------Find Staff--------------//
    let staffFound = await StaffModel.findById(staff);
    if (!staffFound) {
      return next(new AppErr("Staff not found", 404));
    }

    let salary = await SalaryModel.findByIdAndUpdate(salaryId, req.body,{new: true});
    staffFound.salarypaidmonth = salarymonth;

    await staffFound.save();

    return res.status(200).json({
      status: true,
      statuscode: 200,
      message: "Salary Updated successfully",
      data: salary,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

//--------------------Get Salary Of Staff----------------//
const GetStaffSalary = async (req, res, next) => {
  try {
    let { staff } = req.params;
    let salary = await SalaryModel.find({ staff: staff });
    return res.status(200).json({
      status: true,
      statuscode: 200,
      message: "Salary fetched successfully",
      data: salary,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

module.exports = {
  CreateSalary,
  UpdateSalary,
  GetStaffSalary,
};

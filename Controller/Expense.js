const { validationResult } = require("express-validator");
const ExpenseModel = require("../Model/Expense");
const AppErr = require("../Services/AppErr");

//-----------------Create Expense ------------------//
const createExpense = async (req, res, next) => {
  try {
    //---Validation Check ------//
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return next(new AppErr(result.errors[0].msg, 403));
    }
    //--------------Take data---------------//
    let { name, description, amount, Categoery, month, branch } = req.body;

    //----------Create expence-----------//
    let expence = await ExpenseModel.create(req.body);

    res.status(200).json({
      status: true,
      statuscode: 200,
      message: "Expence created successfully",
      data: expence,
    });
  } catch (error) {
    return next(new AppErr(error.message), 500);
  }
};

//-----------------Update Expense ------------------//

const UpdateExpense = async (req, res, next) => {
  try {
    //---Validation Check ------//
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return next(new AppErr(result.errors[0].msg, 403));
    }
    //--------------Take data---------------//
    let { name, description, amount, Categoery, month, branch } = req.body;
    let { id } = req.params;

    //----------Create expence-----------//
    let expence = await ExpenseModel.findByIdAndUpdate(id, req.body, { new: true });

    res.status(200).json({
      status: true,
      statuscode: 200,
      message: "Expence Updated successfully",
      data: expence,
    });
  } catch (error) {
    return next(new AppErr(error.message), 500);
  }
};

//-----------------Get All Expenses ----------------//
const GetAllExpenses = async (req, res, next) => {
  try {
    let { branchId } = req.params;
    if (!branchId) {
      return next(new AppErr("Branch Id is Required", 403));
    }

    let expence = await ExpenseModel.find({ branch: branchId });

    res.status(200).json({
      status: true,
      statuscode: 200,
      message: "Expence Fetched successfully",
      data: expence,
    });
  } catch (error) {
    return next(new AppErr(error.message), 500);
  }
};

//-----------------Get All Expenses ----------------//
const GetSinlgeExpences = async (req, res, next) => {
  try {
    let { expenceId } = req.params;
    if (!expenceId) {
      return next(new AppErr("expenceId Id is Required", 403));
    }

    let expence = await ExpenseModel.findById(expenceId);

    res.status(200).json({
      status: true,
      statuscode: 200,
      message: "Expence Fetched successfully",
      data: expence,
    });
  } catch (error) {
    return next(new AppErr(error.message), 500);
  }
};


//----------------Delete Expence --------------//

const Deleteexpence = async (req, res, next) => {
  try {
    let {expenceId } = req.params
    if (!expenceId) {
      return next(new AppErr("Expence id is required"))
    }
    let deleteexp = await ExpenseModel.findByIdAndDelete(expenceId)
    res.status(200).json({
      status: true,
      statuscode: 200,
      message: "Expence deleted successfully",
    });
  } catch (error) {
    return next(new AppErr(error.message))
  }
}
module.exports = {
  createExpense,
  UpdateExpense,
  GetAllExpenses,
  GetSinlgeExpences,
  Deleteexpence
};

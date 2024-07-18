const { validationResult } = require("express-validator");
const CategoryModel = require("../../Model/Staff/Category");
const AppErr = require("../../Services/AppErr");
const Methods = require("../../Services/GlobalMethod/Method");

const Api = new Methods();

//-----------------------Create a new Branch--------------------------------//

const CreateCategory = async (req, res, next) => {
  try {
    //--------Validation Check--------------//
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return next(new AppErr(result.errors[0].msg, 403));
    }
    let { name } = req.body;
    //----------Create Branch--------------//
    let response = await Api.create(CategoryModel, req.body);
    if (response.status === 200) {
      return res.status(200).json({
        status: true,
        statuscode: 200,
        message: "Category Created successfully",
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

const UpdateCategory = async (req, res, next) => {
  try {
    //--------Validation Check--------------//
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return next(new AppErr(result.errors[0].msg, 403));
    }
    let { name } = req.body;
    let { id } = req.params;

    //---------Check Branch ------------//
    let Category = await CategoryModel.findById(id);
    if (!Category) {
      next(new AppErr("Category Not Found", 404));
    }
    //----------Create Category--------------//
    let response = await Api.update(CategoryModel, id, req.body);
    if (response.status === 200) {
      return res.status(200).json({
        status: true,
        statuscode: 200,
        message: "Category Updated successfully",
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

const GetAllCategory = async (req, res, next) => {
  try {
    let Category = await CategoryModel.find().populate("");
    return res.status(200).json({
      status: true,
      statuscode: 200,
      message: "Category fetched successfully",
      data: Category,
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

//----------------GET Single Branch -----------------//

const GetSingleCategory = async (req, res, next) => {
  try {
    let { id } = req.params;
    let Category = await CategoryModel.findById(id);
    return res.status(200).json({
      status: true,
      statuscode: 200,
      message: "Category fetched successfully",
      data: Category,
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

module.exports = {
  CreateCategory,
  UpdateCategory,
  GetAllCategory,
  GetSingleCategory,
};

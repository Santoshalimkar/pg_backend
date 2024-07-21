const { validationResult } = require("express-validator");

//-----------------Create Salary-----------------------//
const CreateSalary = async (req, res, next) => {
  try {
    //---Validation Check ------//
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return next(new AppErr(result.errors[0].msg, 403));
    }
    
  } catch (error) {}
};

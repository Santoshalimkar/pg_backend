const { validationResult } = require("express-validator");
const AppErr = require("../../Services/AppErr");
const SuperAdminModel = require("../../Model/SuperAdminAndAdmin/SuperAdmin");
const Methods = require("../../Services/GlobalMethod/Method");
const GenerateToken = require("../../Services/Jwt/GenerteToken");

const Api = new Methods();

//-----------------Create Super Admin-------------------//
const CreateSuperAdmin = async (req, res, next) => {
  try {
    //------------Validation Check ---------------//
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return next(new AppErr(result.errors[0].msg, 403));
    }

    let { name, Email, Number, Password } = req.body;
    //---------------Check Email -------------------//
    let EmailFound = await SuperAdminModel.find({ Email: Email });
    if (EmailFound.length > 0) {
      return next(new AppErr("Email Already Exists", 402));
    }
    //---------------Check Number ------------------//
    let NumberFound = await SuperAdminModel.find({ Number: Number });
    if (NumberFound.length > 0) {
      return next(new AppErr("Number Already Exists", 402));
    }

    //------------Store Plain Password-------------//
    req.body.Password = Password;
    req.body.role = "owner";

    //----------------Create Super Admin ---------------//
    try {
      const response = await Api.create(SuperAdminModel, req.body);
      if (response.status === 200) {
        return res.status(200).json({
          status: true,
          statuscode: 200,
          message: "Super Admin Created successfully",
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
    return next(new AppErr(error.message, 404));
  }
};

//------------------Get Super Admin --------------------//

const GetSuperAdmin = async (req, res, next) => {
  try {
    let response = await Api.getAll(SuperAdminModel);
    if (response.status === 200) {
      return res.status(200).json({
        status: true,
        statuscode: 200,
        message: "Super Admin Fetched successfully",
        data: response.result,
      });
    } else {
      return res.status(400).json({
        status: false,
        statuscode: 400,
        message: response.result,
      });
    }
  } catch (error) {
    return next(new AppErr(error.message, 404));
  }
};

//------------------Get By Id Super Admin -------------//

const GetSuperAdminID = async (req, res, next) => {
  try {
    let { id } = req.params;
    let response = await Api.getById(SuperAdminModel, id);
    if (response.status === 200) {
      return res.status(200).json({
        status: true,
        statuscode: 200,
        message: "Super Admin Fetched successfully",
        data: response.result,
      });
    } else {
      return res.status(400).json({
        status: false,
        statuscode: 400,
        message: response.result,
      });
    }
  } catch (error) {
    return next(new AppErr(error.message, 404));
  }
};

//-----------------Update Super Admin --------------------//

const UpdateSuperAdmin = async (req, res, next) => {
  try {
    //------------Validation Check ---------------//
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return next(new AppErr(result.errors[0].msg, 403));
    }
    const { id } = req.params;
    let { name, Email, Number, Password } = req.body;
    //---------------Check Email -------------------//
    let EmailFound = await SuperAdminModel.find({
      Email: Email,
      _id: { $ne: id },
    });
    if (EmailFound.length > 0) {
      return next(new AppErr("Email Already Exists", 402));
    }
    //---------------Check Number ------------------//
    let NumberFound = await SuperAdminModel.find({
      Number: Number,
      _id: { $ne: id },
    });
    if (NumberFound.length > 0) {
      return next(new AppErr("Number Already Exists", 402));
    }

    //------------Store Plain Password-------------//
    req.body.Password = Password;

    //----------------Update Super Admin ---------------//
    try {
      const response = await Api.update(SuperAdminModel, id, req.body);
      if (response.status === 200) {
        return res.status(200).json({
          status: true,
          statuscode: 200,
          message: "Super Admin Updated successfully",
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
    return next(new AppErr(error.message, 404));
  }
};

//---------------Login Super Admin ----------------//

const LoginSuperAdmin = async (req, res, next) => {
  try {
    //------------Validation Check ---------------//
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return next(new AppErr(result.errors[0].msg, 403));
    }

    let { Email, Password } = req.body;

    //-------------Email Check---------------//
    let EmailFound = await SuperAdminModel.findOne({ Email: Email });
    if (!EmailFound) {
      return next(new AppErr("Invalid Email", 404));
    }

    //--------------Check Status----------------//
    if (EmailFound.blocked) {
      return next(new AppErr("You Are Blocked! Please Connect Awt Team", 404));
    }

    //------------Check Password-------------//
    if (EmailFound.Password !== Password) {
      return next(new AppErr("Invalid Password", 404));
    }

    //------------Generate Token --------------//
    const payload = { id: EmailFound._id, role: "owner" };
    const token = GenerateToken(payload);

    return res.status(200).json({
      status: true,
      statuscode: 200,
      message: "Login successful",
      data: EmailFound,
      token: token,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

//-------------------Block Super Admin -------------------------//

const BlockSuperAdmin = async (req, res, next) => {
  try {
    let id = req.params.id;
    let superadmin = await SuperAdminModel.findById(id);
    superadmin.blocked = true;
    await superadmin.save();

    return res.status(200).json({
      status: true,
      statuscode: 200,
      message: "Blocked successfully",
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

//-------------------Unblock Super Admin -------------------------//

const UNBlockSuperAdmin = async (req, res, next) => {
  try {
    let id = req.params.id;
    let superadmin = await SuperAdminModel.findById(id);
    superadmin.blocked = false;
    await superadmin.save();

    return res.status(200).json({
      status: true,
      statuscode: 200,
      message: "Unblocked successfully",
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

module.exports = {
  CreateSuperAdmin,
  GetSuperAdmin,
  GetSuperAdminID,
  UpdateSuperAdmin,
  LoginSuperAdmin,
  BlockSuperAdmin,
  UNBlockSuperAdmin,
};

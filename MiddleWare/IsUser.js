const UserModel = require("../Model/User");
const AppErr = require("../Services/AppErr");
const VerifyToken = require("../Services/Jwt/VerifyToken");

const isUser = async (req, res, next) => {
  try {
    let { token } = req.headers;
    let decoded = VerifyToken(token);
    req.user = decoded.id;
    if (!decoded) {
      return next(new AppErr("Invalid token", 404));
    }
    let user = await UserModel.findById(decoded.id);
    if (!user) {
      return next(new AppErr("User not found", 404));
    }

    next();
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

module.exports = {
  isUser
};

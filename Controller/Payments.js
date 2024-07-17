const { validationResult } = require("express-validator");
const AppErr = require("../Services/AppErr");
const UserModel = require("../Model/User");
const {
  getMonthDayDifference,
  calculateRent,
  calculatePeriods,
} = require("../Services/PaymnetCal");
const RoomModel = require("../Model/Rooms");

//--------------Create Payment --------------------//
const CreatePayment = async (req, res, next) => {
  try {
    //-------Validation Check--------------//
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return next(new AppErr(result.errors[0].msg, 403));
    }
    let { UserId, Amount, NumberOfmonth } = req.body;
    //------ Get UserId -------------//
    let user = await UserModel.findOne({ UserId: UserId });
    if (!user) {
      return next(new AppErr("user not found", 404));
    }
    //---------Get Room--------------//
    let room = await RoomModel.findById(user.room[0]);
    if (!room) {
      return next(new AppErr("room not found", 404));
    }
    //----------Check User Belong to that room or not------------//
    if (!room.Users.includes(user._id)) {
      return next(new AppErr("User not present in room", 403));
    }
    //------------Check User Due Amount ----------------//
    let { months, days } = getMonthDayDifference(user.LastDate, new Date());
    let totalrent = calculateRent(room.Amount, months, days, user.DueAmount);
    let periods = calculatePeriods(room.Amount, Amount, totalrent);
    req.body.PayemntDate = new Date();
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

//-------------Update Payment -------------------//

//-------------Get All Payment of Branch --------//

//------------Today all Payment -----------------//

//--------------Last One Month Payment ---------//

//------------Last One Year Payment ------------//

module.exports = { CreatePayment };

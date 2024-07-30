const ExpenseModel = require("../Model/Expense");
const PaymentModel = require("../Model/Payment");
const RoomModel = require("../Model/Rooms");

const GetDashBoardDetails = async (req, res, next) => {
  try {
    // Fetch all rooms
    const rooms = await RoomModel.find();

    let totalBeds = 0;
    let totalBooked = 0;
    let totalRemaining = 0;

    rooms.forEach((room) => {
      totalBeds += room.SharingType;
      totalBooked += room.SharingType - room.reaminingBed;
      totalRemaining += room.reaminingBed;
    });

    // Fetch all payments
    const payments = await PaymentModel.find();

    let totalEarnings = 0;

    payments.forEach((payment) => {
      totalEarnings += payment.Amount;
    });

    // Fetch all expenses
    const expenses = await ExpenseModel.find();

    let totalExpenses = 0;

    expenses.forEach((expense) => {
      totalExpenses += expense.amount;
    });

    res.json({
      totalBeds,
      totalBooked,
      totalRemaining,
      totalEarnings,
      totalExpenses,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getearningandexpencemonth = async (req, res, next) => {
  try {
    // Aggregate monthly earnings
    const monthlyEarnings = await PaymentModel.aggregate([
      {
        $group: {
          _id: {
            month: { $month: "$PayemntDate" },
            year: { $year: "$PayemntDate" },
          },
          totalEarnings: { $sum: "$Amount" },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ]);

    // Aggregate monthly expenses
    const monthlyExpenses = await ExpenseModel.aggregate([
      {
        $group: {
          _id: { month: "$month", year: { $year: "$createdAt" } },
          totalExpenses: { $sum: "$amount" },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ]);

    res.json({
      monthlyEarnings,
      monthlyExpenses,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  GetDashBoardDetails,
  getearningandexpencemonth,
};

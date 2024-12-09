const ExpenseModel = require("../Model/Expense");
const NotificationModel = require("../Model/Notification");
const PaymentModel = require("../Model/Payment");
const RoomModel = require("../Model/Rooms");
const CategoryModel = require("../Model/Staff/Category");
const StaffModel = require("../Model/Staff/Staff");
const AdminModel = require("../Model/SuperAdminAndAdmin/Admin");
const BranchModel = require("../Model/SuperAdminAndAdmin/Branch");
const SuperAdminModel = require("../Model/SuperAdminAndAdmin/SuperAdmin");
const Tickemodel = require("../Model/Tickets");
const UserModel = require("../Model/User");

const GetDashBoardDetails = async (req, res, next) => {
  try {
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
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          totalExpenses: { $sum: "$amount" },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ]);

    // Helper to convert month number to month name
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    // Convert aggregated data to the desired format
    const combinedData = [];

    // Helper to find total for a given month and year
    const findTotal = (arr, month, year) => {
      const result = arr.find(
        (item) => item._id.month === month && item._id.year === year
      );
      return result ? result.totalEarnings || result.totalExpenses : 0;
    };

    monthlyEarnings.forEach((earning) => {
      const month = earning._id.month;
      const year = earning._id.year;
      const expense = findTotal(monthlyExpenses, month, year);

      combinedData.push({
        month: monthNames[month - 1],
        Income: earning.totalEarnings,
        Expense: expense,
      });
    });

    // Add expenses for any months not present in earnings
    monthlyExpenses.forEach((expense) => {
      const month = expense._id.month;
      const year = expense._id.year;
      if (!combinedData.some((data) => data.month === monthNames[month - 1])) {
        combinedData.push({
          month: monthNames[month - 1],
          Income: 0,
          Expense: expense.totalExpenses,
        });
      }
    });

    // Sort by month
    combinedData.sort(
      (a, b) => monthNames.indexOf(a.month) - monthNames.indexOf(b.month)
    );

    res.json(combinedData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//------------Get All Expence based on categoery -------------//

const ExpencebyCategoery = async (req, res, next) => {
  try {
    const totalExpensesByName = await ExpenseModel.aggregate([
      {
        $group: {
          _id: "$name",
          totalAmount: { $sum: "$amount" },
        },
      },
      {
        $project: {
          _id: 0,
          name: "$_id",
          totalAmount: 1,
        },
      },
      {
        $sort: { totalAmount: -1 },
      },
    ]);

    res.status(200).json(totalExpensesByName);
  } catch (error) {
    next(error);
  }
};

//------Delete All Collection ---------//

const AllModal = async (req, res, next) => {
  // let user=await UserModel.deleteMany()
  // await RoomModel.deleteMany()
  // await PaymentModel.deleteMany()
  // await Tickemodel.deleteMany()
  // await NotificationModel.deleteMany()
  // await AdminModel.deleteMany()
  // await CategoryModel.deleteMany()
  // await StaffModel.deleteMany()
  // await ExpenseModel.deleteMany()
  // await SuperAdminModel.deleteMany()
  // await BranchModel.deleteMany()

  res.send("done");
};

module.exports = {
  GetDashBoardDetails,
  getearningandexpencemonth,
  ExpencebyCategoery,
  AllModal,
};

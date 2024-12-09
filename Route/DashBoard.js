const express = require('express')
const { IsSuperOrAdmin } = require('../MiddleWare/isSuperOrAdmin')
const { GetDashBoardDetails, getearningandexpencemonth, ExpencebyCategoery, AllModal } = require('../Controller/DashBoard')

const DashBoardRouter = express.Router()


DashBoardRouter.get("/dashboard/history", IsSuperOrAdmin, GetDashBoardDetails)
DashBoardRouter.get("/earning/history", IsSuperOrAdmin, getearningandexpencemonth)
DashBoardRouter.get("/expence/dashboard", IsSuperOrAdmin, ExpencebyCategoery)
// DashBoardRouter.delete("/del",AllModal)

module.exports = DashBoardRouter
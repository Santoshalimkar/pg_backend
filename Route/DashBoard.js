const express = require('express')
const { IsSuperOrAdmin } = require('../MiddleWare/isSuperOrAdmin')
const { GetDashBoardDetails, getearningandexpencemonth } = require('../Controller/DashBoard')

const DashBoardRouter=express.Router()


DashBoardRouter.get("/dashboard/history",IsSuperOrAdmin,GetDashBoardDetails)
DashBoardRouter.get("/earning/history",IsSuperOrAdmin,getearningandexpencemonth)

module.exports = DashBoardRouter
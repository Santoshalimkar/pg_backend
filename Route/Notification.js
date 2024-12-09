const express = require('express')
const { IsSuperOrAdmin } = require('../MiddleWare/isSuperOrAdmin')
const { SendNotification, GetNotification, DeleteNotification } = require('../Controller/Notification')
const { isUser } = require('../MiddleWare/IsUser')


const NotificationRouter = express.Router()


NotificationRouter.post("/send/notification", IsSuperOrAdmin, SendNotification)

NotificationRouter.get("/get/notification/:branchId", IsSuperOrAdmin, GetNotification)

NotificationRouter.get("/get/user/notification/:branchId", isUser, GetNotification)

NotificationRouter.delete("/delete/notification/:notificationId", IsSuperOrAdmin, DeleteNotification)

module.exports = NotificationRouter
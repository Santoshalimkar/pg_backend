const express = require("express");
const { IsSuperOrAdmin } = require("../MiddleWare/isSuperOrAdmin");
const { CreatePayment } = require("../Controller/Payments");

const paymentRouter = express.Router();

paymentRouter.post("/create/payment",IsSuperOrAdmin,CreatePayment);

module.exports = paymentRouter;

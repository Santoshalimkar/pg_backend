const express = require("express");
const DbConnection = require("./Services/Db/Connection");
const morgan = require("morgan");
const helmet = require("helmet");
const mongosantize = require("express-mongo-sanitize");
const bodyParser = require("body-parser");
const cors = require("cors");
const globalErrHandler = require("./MiddleWare/GlobalError");
const AppErr = require("./Services/AppErr");
const SuperAdminRouter = require("./Route/SuperAdminAndAdmin/SuperAdmin");
const { AdminRouter } = require("./Route/SuperAdminAndAdmin/Admin");
const BranchRouter = require("./Route/SuperAdminAndAdmin/Branch");
const RoomRouter = require("./Route/Rooms");
const cloudinary = require("cloudinary");
const UserRouter = require("./Route/Users");
const paymentRouter = require("./Route/Payment");
const StaffRouter = require("./Route/Staff");
const expenceRouter = require("./Route/Expence");
const TicketRouter = require("./Route/Ticket");
const DashBoardRouter = require("./Route/DashBoard");

const app = express();

const corsOptions = {
  origin: "http://localhost:3000",
  methods: "GET,POST,PUT,DELETE,PATCH",
  allowedHeaders: ["Content-Type", "Authorization"],
};

//------IN Build Middleware----------//
app.use(morgan("combined"));
app.use(helmet());
app.use(cors(corsOptions));
app.use(mongosantize());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//-------------Cloudinary---------------//
cloudinary.config({
  cloud_name: "dxlmwq61j",
  api_key: "449172957755657",
  api_secret: "_svozk1NVYoC0NWVSoV-fhR-j5c",
});

//--------------- Route Middleware ------------------//
app.use("/api/v1/SuperAdmin", SuperAdminRouter);
app.use("/api/v1/admin", AdminRouter);
app.use("/api/v1/branch", BranchRouter);
app.use("/api/v1/rooms", RoomRouter);
app.use("/api/v1/users", UserRouter);
app.use("/api/v1/payment", paymentRouter);
app.use("/api/v1/staff", StaffRouter);
app.use("/api/v1/expence", expenceRouter);
app.use("/api/v1/ticket", TicketRouter);
app.use("/api/v1/dashboard", DashBoardRouter);

//--------------Not Found Route-------------------//
app.get("*", (req, res, next) => {
  return next(new AppErr("Route not found", 404));
});

//----------Global Error -----------//
app.use(globalErrHandler);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  DbConnection();
  console.log(`listening on ${PORT}`);
});

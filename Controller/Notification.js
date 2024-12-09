const admin = require("firebase-admin");
const UserModel = require("../Model/User");
const AppErr = require("../Services/AppErr");
const NotificationModel = require("../Model/Notification");

const serviceAccount = {
  type: "service_account",
  project_id: process.env.GOOGLE_PROJECT_ID,
  private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
  private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"), 
  client_email: process.env.GOOGLE_CLIENT_EMAIL,
  client_id: process.env.GOOGLE_CLIENT_ID,
  auth_uri: process.env.GOOGLE_AUTH_URI,
  token_uri: process.env.GOOGLE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.GOOGLE_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.GOOGLE_CLIENT_X509_CERT_URL,
  universe_domain: "googleapis.com",
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const SendNotification = async (req, res, next) => {
  try {
    let { branch, titile, Desc, Food } = req.body;
    let user = await UserModel.find({ branch: branch });
    console.log(user);
    let noti = await NotificationModel.create(req.body);
    const token = user
      .filter((item) => item.devicetoken)
      .map((item) => item.devicetoken);
    if (token.length > 0) {
      const response = await admin.messaging().sendMulticast({
        tokens: token,
        notification: {
          title: titile,
        },
      });
    }

    return res.status(200).json({
      status: true,
      statuscode: 200,
      message: "Notification Created successfully",
      data: noti,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

//--------Get Allnotification By Branch Id ---------------//
const GetNotification = async (req, res, next) => {
  try {
    let { branchId } = req.params;
    let notification = await NotificationModel.find({ branch: branchId });
    return res.status(200).json({
      status: true,
      statuscode: 200,
      message: "Notification Fetched successfully",
      data: notification,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

//---------- Delete Notification ---------//
const DeleteNotification = async (req, res, next) => {
  try {
    let { notificationId } = req.params;
    let notification = await NotificationModel.findByIdAndDelete(
      notificationId
    );
    return res.status(200).json({
      status: true,
      statuscode: 200,
      message: "Notification Deleted successfully",
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

module.exports = {
  SendNotification,
  GetNotification,
  DeleteNotification,
};

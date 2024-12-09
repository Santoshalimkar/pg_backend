const mongoose = require('mongoose')


const NotificationSchema = new mongoose.Schema({
    branch: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    titile: {
        type: String,
        required: true
    },
    Desc: {
        type: String
    },
    Food: [
        {
            morning: [],
            evening: [],
            night: []
        }
    ]
}, {
    timestamps: true
})


const NotificationModel = mongoose.model("Notification", NotificationSchema)

module.exports = NotificationModel
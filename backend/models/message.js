const {DateTime} = require('luxon');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    message: {
        type: String,
        required: true,
        maxLength: 200
    }, 
    timestamp: {
        type: Date,
        default: () => DateTime.now().toJSDate(),
        required: true,
    },
    convo: {
        type: Schema.Types.ObjectId,
        ref: "Convo",
        required: true,
    },
    senderId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    username: {
        type: String,
        required: true,
        maxLength: 64
    }
})

MessageSchema.virtual("timestamp_formatted").get(function () {
    return DateTime.fromJSDate(this.timestamp).toLocaleString(DateTime.DATE_MED);
});

module.exports = mongoose.model("Message", MessageSchema);
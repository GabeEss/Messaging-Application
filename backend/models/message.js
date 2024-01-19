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
        required: true,
    },
    convo: {
        type: Schema.Types.ObjectId,
        ref: "Convo",
        required: true,
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }
})

MessageSchema.virtual("timestamp_formatted").get(function () {
    return DateTime.fromJSDate(this.timestamp).toLocaleString(DateTime.DATE_MED);
});

module.exports = mongoose.model("Message", MessageSchema);
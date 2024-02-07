const {DateTime} = require('luxon');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ConvoSchema = new Schema({
    title: {
        type: String,
        required: true,
        maxLength: 64,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    messages: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'Message',
        }],
        required: true,
    },
    users: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'User',
        }],
        validate: [arrayLimit, 'Convo needs at least 1 user'],
        required: true,
    },
    date_created: {
        type: Date,
        default: () => DateTime.now().toJSDate(),
        required: true,
    },
})

function arrayLimit(val) {
    return val.length > 0;
}

module.exports = mongoose.model('Convo', ConvoSchema);
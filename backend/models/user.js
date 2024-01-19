const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        maxLength: 64
    },
    friends: [{ type: Types.ObjectId, ref: "User" }],
    status: {
        type: String,
        required: true,
        enum: ["Online", "Busy", "Offline"],
        default: "Offline",
      },
    age: {
        type: Number,
        min: 13,
        required: true,
    }
})

module.exports = mongoose.model("User", UserSchema);
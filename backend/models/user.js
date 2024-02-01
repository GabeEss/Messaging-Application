const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    auth0id: {
        type: String,
        required: true,
        unique: true,
        maxLength: 64
    },
    username: {
        type: String,
        required: true,
        maxLength: 64
    },
    friends: [{ type: Schema.Types.ObjectId, ref: "User" }],
})

module.exports = mongoose.model("User", UserSchema);
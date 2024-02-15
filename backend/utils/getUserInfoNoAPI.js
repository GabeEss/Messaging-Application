const User = require('../models/user');

const userInfoNoAPI = async (authHeader) => {
    // Parse the 'X-User' header to get the user object
    const user = JSON.parse(authHeader);
    const userId = user.sub;
    const mongoUser = await User.findOne({ auth0id: userId }).exec(); // MongoDB user

    return mongoUser;
}

module.exports = userInfoNoAPI;
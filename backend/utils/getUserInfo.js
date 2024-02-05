const axios = require('axios');
const User = require('../models/User');

// Get info from token
const getUserInfo = async (authHeader) => {
    if (!authHeader || !authHeader.includes(' ')) {
        throw new Error('Invalid authorization header');
    }
    const accessToken = authHeader.split(" ")[1];
    const response = await axios.get(process.env.AUTH_ISSUER + "/userinfo", {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    const userInfo = response.data; // Auth0 user info
    const userId = userInfo.sub; // Auth0 user id
    const username = userInfo.nickname; // Auth0 username

    if (typeof userId !== 'string' || typeof username !== 'string') {
        return res.status(401).json({success: false, message: 'Unauthorized'});
      }

    const user = await User.findOne({ auth0id: userId }).exec(); // MongoDB user

    return {
        userId: userId,
        username: username,
        mongoUser: user,
    }
}

module.exports = getUserInfo;
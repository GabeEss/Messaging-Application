const axios = require('axios');

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

    const userInfo = response.data;
    const userId = userInfo.sub;
    const username = userInfo.nickname;

    return {
        userId: userId,
        username: username
    }
}

module.exports = getUserInfo;
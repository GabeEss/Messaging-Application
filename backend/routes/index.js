require('dotenv').config();
const express = require('express');
const router = express.Router();
const axios = require('axios');

const convo_controller = require('../controllers/ConvoController');
const message_controller = require('../controllers/MessageController');
const user_controller = require('../controllers/UserController');

/// GET home page. ///
router.get('/', (req, res) => {
    res.send("Hello from index route.");
});

router.get('/protected', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
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
        res.send("Hello from protected route.");
        console.log(userInfo);
    } catch (error) {
        console.log('Error:', error.message);
        res.status(401).send("Unauthorized:" + error.message);
    }
});

// router.get('/', user_controller.index);

/// CONVO ROUTES ///

router.post("/convo", convo_controller.convo_create_post);
router.delete("/convo/:id", convo_controller.convo_delete);
router.put("/convo/:id", convo_controller.convo_title_update);
router.put("/convo/:id/add", convo_controller.convo_user_add);
router.put("/convo/:id/remove", convo_controller.convo_user_remove);
router.get("/convo/:id", convo_controller.convo_detail);
router.get("/convos", convo_controller.convo_list);

/// MESSAGE ROUTES ///

router.post("/message", message_controller.message_create_post);
router.delete("/message/:id", message_controller.message_delete);
router.put("/message/:id", message_controller.message_update);
router.get("/message/:id", message_controller.message_detail);
router.get("/messages", message_controller.message_list);

/// USER ROUTES ///

router.get("/users", user_controller.user_list);
router.get("/user/:id", user_controller.user_detail);
router.get("/user/:id/friends", user_controller.user_friends_get);
router.put("/user/:id/friends/add", user_controller.user_friend_add);
router.put("/user/:id/friends/remove", user_controller.user_friend_remove);
router.put("/user/:id", user_controller.user_update);
router.post("/user/register", user_controller.user_create_post);
router.post("/user/password/change", user_controller.user_password_change_post);
router.delete("/user/:id", user_controller.user_delete);

module.exports = router;
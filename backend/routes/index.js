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

router.get("/convos", convo_controller.convo_list);
router.post("/convo", convo_controller.convo_create_post);
router.delete("/convo/:id", convo_controller.convo_delete);
router.get("/convo/:id", convo_controller.convo_detail);
router.put("/convo/:id/edit", convo_controller.convo_title_update);
router.put("/convo/:id/add", convo_controller.convo_add_friend);
router.put("/convo/:id/remove", convo_controller.convo_remove_friend);
router.put("/convo/:id/leave", convo_controller.convo_leave);

/// MESSAGE ROUTES ///

router.post("/convo/:id", message_controller.message_create_post);
router.delete("/convo/:id/message/:id", message_controller.message_delete);
router.put("/convo/:id/message/:id", message_controller.message_update);

/// USER ROUTES ///

router.get("/users", user_controller.user_list);
router.get("/user", user_controller.user_detail);
router.get("/user/friends", user_controller.user_friends_get);
router.put("/user/friends/add", user_controller.user_friend_add);
router.put("/user/friends/remove", user_controller.user_friend_remove);
router.put("/user", user_controller.user_update);
router.post("/user/register", user_controller.user_create_post);
router.post("/user/password/change", user_controller.user_password_change_post);
router.delete("/user", user_controller.user_delete);

module.exports = router;
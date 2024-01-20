const express = require('express');
const router = express.Router();
const { requiresAuth } = require('express-openid-connect');

const convo_controller = require('../controllers/ConvoController');
const message_controller = require('../controllers/MessageController');
const user_controller = require('../controllers/UserController');

/// GET home page. ///
router.get('/', user_controller.index);
// router.get('/', (req, res) => { 
//     res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
// });

/// CONVO ROUTES ///

router.post("/convo", requiresAuth(), convo_controller.convo_create_post);
router.delete("/convo/:id", requiresAuth(), convo_controller.convo_delete);
router.put("/convo/:id", requiresAuth(), convo_controller.convo_title_update);
router.put("/convo/:id/add", requiresAuth(), convo_controller.convo_user_add);
router.put("/convo/:id/remove", requiresAuth(), convo_controller.convo_user_remove);
router.get("/convo/:id", requiresAuth(), convo_controller.convo_detail);
router.get("/convos", requiresAuth(), convo_controller.convo_list);

/// MESSAGE ROUTES ///

router.post("/message", requiresAuth(), message_controller.message_create_post);
router.delete("/message/:id", requiresAuth(), message_controller.message_delete);
router.put("/message/:id", requiresAuth(), message_controller.message_update);
router.get("/message/:id", requiresAuth(), message_controller.message_detail);
router.get("/messages", requiresAuth(), message_controller.message_list);

/// USER ROUTES ///

router.get("/users", requiresAuth(), user_controller.user_list);
router.get("/user/:id", requiresAuth(), user_controller.user_detail);
router.get("/user/:id/friends", requiresAuth(), user_controller.user_friends_get);
router.put("/user/:id/friends/add", requiresAuth(), user_controller.user_friend_add);
router.put("/user/:id/friends/remove", requiresAuth(), user_controller.user_friend_remove);
router.put("/user/:id", requiresAuth(), user_controller.user_update);
router.post("/user", user_controller.user_create_post); // No requiresAuth() here
router.post("/user/login", user_controller.user_login_post); // No requiresAuth() here
router.post("/user/logout", requiresAuth(), user_controller.user_logout_post);
router.post("/user/password/change", requiresAuth(), user_controller.user_password_change_post);
router.delete("/user/:id", requiresAuth(), user_controller.user_delete);

module.exports = router;
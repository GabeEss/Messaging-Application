const express = require('express');
const router = express.Router();

const convo_controller = require('../controllers/ConvoController');
const message_controller = require('../controllers/MessageController');
const user_controller = require('../controllers/UserController');

/// GET home page. ///
router.get('/', user_controller.index);

/// CONVO ROUTES ///

// POST request for creating convo.
router.post("/convo", convo_controller.convo_create_post);

// DELETE request to delete convo.
router.delete("/convo/:id", convo_controller.convo_delete);

// PUT request to update convo title.
router.put("/convo/:id", convo_controller.convo_title_update);

// PUT request to add user to convo.
router.put("/convo/:id/add", convo_controller.convo_user_add);

// PUT request to remove user from convo.
router.put("/convo/:id/remove", convo_controller.convo_user_remove);

// GET request for one convo.
router.get("/convo/:id", convo_controller.convo_detail);

// GET request for list of all convos.
router.get("/convos", convo_controller.convo_list);

/// MESSAGE ROUTES ///

// POST request for creating message.
router.post("/message", message_controller.message_create_post);

// DELETE request to delete message.
router.delete("/message/:id", message_controller.message_delete);

// PUT request to update message.
router.put("/message/:id", message_controller.message_update);

// GET request for one message.
router.get("/message/:id", message_controller.message_detail);

// GET request for list of all messages.
router.get("/messages", message_controller.message_list);

/// USER ROUTES ///

// GET request for list of all users.
router.get("/users", user_controller.user_list);

// GET request for one user.
router.get("/user/:id", user_controller.user_detail);

// GET request for user friends.
router.get("/user/:id/friends", user_controller.user_friends_get);

// PUT request to add a friend to a user.
router.put("/user/:id/friends/add", user_controller.user_friend_add);

// PUT request to remove a friend from a user.
router.put("/user/:id/friends/remove", user_controller.user_friend_remove);

// PUT request to update user.
router.put("/user/:id", user_controller.user_update);

// POST request for creating user.
router.post("/user", user_controller.user_create_post);

// POST request for user login.
router.post("/user/login", user_controller.user_login_post);

// POST request for user logout.
router.post("/user/logout", user_controller.user_logout_post);

// POST request for user password change.
router.post("/user/password/change", user_controller.user_password_change_post);

// DELETE request to delete user.
router.delete("/user/:id", user_controller.user_delete);

module.exports = router;
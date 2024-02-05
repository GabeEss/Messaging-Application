const User = require('../models/User');
const asyncHandler = require("express-async-handler");
const getUserInfo = require("../utils/getUserInfo");

exports.index = asyncHandler(async(req, res, next) => {
    res.send("NOT IMPLEMENTED: Home");
});

// Display list of all users.
exports.user_list = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: User list");
});

// Display detail page for a specific user.
exports.user_detail = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: User detail: ${req.params.id}`);
});

// Handle user create on POST.
exports.user_create_post = asyncHandler(async (req, res, next) => {
  try {
      const {userId, username, mongoUser} = await getUserInfo(req.headers.authorization);

      // If user is a MongoDB user, return 409
      if(mongoUser) {
        return res.status(409).json({
          success: false,
          message: 'User already exists',
        }); 
      }

      // Create new user in MongoDB from Auth0 user info
      const newUser = new User({ 
        auth0id: userId,
        username: username,
        friends: [],
      });

      await newUser.save();
      
      return res.status(201).json({
        success: true,
        message: 'User registered successfully',
      })
      } catch (error) {
          console.log('Error:', error.message);
          return res.status(500).json({success: false, message: 'Error registering user'});
      }
  });

  // Handle user update information on PUT.
  exports.user_update = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: User update PUT");
  });

// Handle user password change on POST.
exports.user_password_change_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: User password change POST");
});

// Handle user delete on DELETE.
exports.user_delete = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: User DELETE");
});

// Handle display user friends on GET.
exports.user_friends_get = asyncHandler(async (req, res, next) => {
    const {mongoUser} = await getUserInfo(req.headers.authorization); // Get MongoDB user

    if(!mongoUser) {
      return res.status(404).json({success: false, message: 'User not found'});
    }

    return res.status(200).json({success: true, friends: mongoUser.friends});
});

// Handle add user friend on PUT.
exports.user_friend_add = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: User friend add PUT");
});

// Handle remove user friend on PUT.
exports.user_friend_remove = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: User friend remove PUT");
});
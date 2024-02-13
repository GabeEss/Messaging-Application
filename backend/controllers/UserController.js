const User = require('../models/user');
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
      const {userId, username, mongoUser, userEmail} = await getUserInfo(req.headers.authorization);
      console.log("Called get user info");

      if(mongoUser) {
        return res.status(409).json({
          success: false,
          message: 'User already exists',
        }); 
      }

      console.log("Creating user");

      const newUser = new User({ 
        auth0id: userId,
        username: username,
        email: userEmail,
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
    // Parse the 'X-User' header to get the user object
    const user = JSON.parse(req.headers['x-user']);
    const userId = user.sub;
    const mongoUser = await User.findOne({ auth0id: userId }).exec(); // MongoDB user

    if(!mongoUser) {
      return res.status(404).json({success: false, message: 'User not found'});
    }

    // Find user friends
    const friends = await User.find({ _id: { $in: mongoUser.friends } }).select('username').exec();

    return res.status(200).json({success: true, friends: friends});
});

// Handle add user friend on PUT.
exports.user_friend_add = asyncHandler(async (req, res, next) => {
    const {mongoUser} = await getUserInfo(req.headers.authorization);
    console.log("Called get user info");

    if(!mongoUser) {
      return res.status(404).json({success: false, message: 'User not found'});
    }

    const friendEmail = req.body.username;

    const friend = await User.findOne({email: friendEmail}).exec();

    if(!friend) {
      return res.status(404).json({success: false, message: 'Friend not found'});
    }

    if(friendEmail === mongoUser.email) {
      return res.status(409).json({success: false, message: 'Cannot add yourself as a friend'});
    }

    if(mongoUser.friends.some(f => f.toString() === friend._id.toString())) {
      return res.status(409).json({success: false, message: 'Friend already exists'});
    }

    try {
      mongoUser.friends.push(friend._id);
      friend.friends.push(mongoUser._id);

      await mongoUser.save();
      await friend.save();

      return res.status(200).json({success: true, message: 'Friend added successfully'});
    } catch(error) {
      console.log('Error:', error.message);
      return res.status(500).json({success: false, message: 'Error adding friend'});
    }
});

// Handle remove user friend on PUT.
exports.user_friend_remove = asyncHandler(async (req, res, next) => {
    const {mongoUser} = await getUserInfo(req.headers.authorization);
    console.log("Called get user info");

    if(!mongoUser) {
      return res.status(404).json({success: false, message: 'User not found'});
    }

    const friendEmail = req.body.username;

    const friend = await User.findOne({email: friendEmail}).exec();

    if(!friend) {
      return res.status(404).json({success: false, message: 'Friend not found'});
    }

    if(mongoUser.friends.some(f => f.toString() === friend._id.toString())) {
      try {
        mongoUser.friends.pull(friend._id);
        friend.friends.pull(mongoUser._id);

        await mongoUser.save();
        await friend.save();

        return res.status(200).json({success: true, message: 'Friend removed successfully'});
      } catch (error) {
        console.log('Error:', error.message);
        return res.status(500).json({success: false, message: 'Error removing friend'});
      }
    } else {
      return res.status(409).json({success: false, message: 'This user is not a friend'});
    }
});
const User = require('../models/user');
const Convo = require('../models/convo');
const Message = require('../models/message');
const asyncHandler = require("express-async-handler");
const getUserInfo = require("../utils/getUserInfo");
const userInfoNoAPI = require("../utils/getUserInfoNoAPI");
// const axios = require('axios');

// Display detail page for a specific user.
exports.user_detail = asyncHandler(async (req, res, next) => {
    const mongoUser = await userInfoNoAPI(req.headers['x-user']);

    if(!mongoUser) {
      return res.status(404).json({success: false, message: 'User not found'});
    }

    return res.status(200).json({success: true, user: mongoUser});
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

// Handle user delete on DELETE.
exports.user_delete = asyncHandler(async (req, res, next) => {
  // Parse the 'X-User' header to get the user object
  const user = JSON.parse(req.headers['x-user']);
  const userId = user.sub;
  const authHeader = req.headers.authorization;
  const mongoUser = await User.findOne({ auth0id: userId }).exec(); // MongoDB user

  if (!mongoUser) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  if(!userId) {
    return res.status(400).json({success: false, message: 'User ID not found'});
  }

  const session = await User.startSession();
  try {
    // Use transaction to delete the user from MongoDB atomically
    session.startTransaction();
    // Delete convos that the user created
    await Convo.deleteMany({ owner: mongoUser._id }).session(session);
    // Pull the user from all convos they are a part of
    await Convo.updateMany(
      { users: mongoUser._id },
      { $pull: { users: mongoUser._id } }
    ).session(session);
    // Fetch the IDs of the messages sent by the user
    const messageIds = await Message.find({ senderId: mongoUser._id }, { _id: 1 }).session(session);

    // Convert the messageIds to an array of strings for the $pull operation
    const messageIdsArray = messageIds.map(message => message._id.toString());

    // Remove the message IDs from the messages array in all conversations
    await Convo.updateMany(
      {},
      { $pull: { messages: { $in: messageIdsArray } } }
    ).session(session);
    // Delete messages sent by the user within the messages collection
    await Message.deleteMany({ senderId: mongoUser._id }).session(session);
    // Pull the user from all friends lists
    await User.updateMany(
      { friends: mongoUser._id },
      { $pull: { friends: mongoUser._id } }
    ).session(session);
    // Delete the user from the users colllection
    await User.deleteOne({ auth0id: userId }).session(session);
    // NOTE: user messages in the convos collection are not deleted if they do not own the convo

    if (!authHeader || !authHeader.includes(' ')) {
      throw new Error('Invalid authorization header');
    }
    

    await session.commitTransaction();
    res.json({ success: true, message: 'User removed from mongo successfully' });
  } catch (error) {
    await session.abortTransaction();
    return res.status(500).json({success: false, message: 'Error deleting user'});
  } finally {
    session.endSession();
  }

    // const accessToken = authHeader.split(" ")[1];

    // let data = JSON.stringify({
    //   "user_metadata": {
    //     "deleteAccount": true
    //   }
    // });
    

    // // CANNOT PROCEED. NEED MANAGEMENT TOKEN TO PATCH USER METADATA
    // // REQUIRES MACHINE TO MACHINE APPLICATION
    // let config = {
    //   method: 'patch',
    //   url: `${process.env.AUTH_ISSUER}/api/v2/users/${userId}`,
    //   headers: { 
    //     'Content-Type': 'application/json', 
    //     'Accept': 'application/json',
    //     'Authorization': `Bearer ${accessToken}`
    //   },
    //   data : data
    // };

    // const response = await axios(config);

  //   // If the patch in Auth0 was successful, commit the transaction
  //   if (response.status === 200) {
  //     await session.commitTransaction();
  //     res.json({ success: true, message: 'User marked for deletion successfully' });
  //   } else {
  //     // If the deletion in Auth0 failed, abort the transaction
  //     await session.abortTransaction();
  //     res.status(500).json({ success: false, error: 'An error occurred while deleting the user' });
  //   }
  // } catch (error) {
  //   // If an error occurred, abort the transaction
  //   await session.abortTransaction();
  //   res.status(500).json({ success: false, error: 'An error occurred while deleting the user' });
  // } finally {
  //   session.endSession();
  // }
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
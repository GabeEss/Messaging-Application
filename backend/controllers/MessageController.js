const Message = require("../models/message");
const Convo = require("../models/convo");
const User = require("../models/user");
const { DateTime } = require("luxon");
const asyncHandler = require("express-async-handler");
const getUserInfo = require("../utils/getUserInfo");

// Handle message create on POST.
exports.message_create_post = asyncHandler(async (req, res, next) => {
  // Parse the 'X-User' header to get the user object
  const user = JSON.parse(req.headers['x-user']);
  const userId = user.sub;
  const mongoUser = await User.findOne({ auth0id: userId }).exec(); // MongoDB user

  if (!mongoUser) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  const message = req.body.message;
  const convoId = req.params.id;
  const convo = await Convo.findById(convoId).populate('messages').exec();

  if(!convo) {
    return res.status(404).json({
      success: false,
      message: 'Convo required',
    });
  }

  // Check if user is authorized to access this conversation
  for(let i = 0; i < convo.users.length; i++) {
    if(convo.users[i].toString() == mongoUser._id.toString()) {
      try {
        // console.log("Authorized to message");
        const newMessage = new Message({
          message: message,
          timestamp: DateTime.now().toJSDate(),
          convo: convoId,
          senderId: mongoUser._id,
          username: mongoUser.username,
        });
      
        await newMessage.save();
        convo.messages.push(newMessage);
        await convo.save();
      
        return res.status(201).json({
          success: true,
          message: "Message sent successfully",
          convo: convo,
        });
      } catch (error) {
        console.log('Error:', error.message);
        return res.status(500).json({success: false, message: 'Error sending message'});
      }
    }
  }

  return res.status(403).json({
    success: false,
    message: "You are not authorized to access this conversation",
  });
});

// Handle message delete on DELETE.
exports.message_delete = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Message DELETE");
});

// Handle message update on PUT.
exports.message_update = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Message update PUT");
});
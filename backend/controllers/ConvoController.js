const Convo = require("../models/convo");
const User = require("../models/user");
const Message = require("../models/message");
const { DateTime } = require("luxon");
const asyncHandler = require("express-async-handler");
const mongoose = require('mongoose');
const getUserInfo = require("../utils/getUserInfo");
const userInfoNoAPI = require("../utils/getUserInfoNoAPI");

// Display list of all convos.
exports.convo_list = asyncHandler(async (req, res, next) => {
  const mongoUser = await userInfoNoAPI(req.headers['x-user']);

  if (!mongoUser) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  console.log("Getting convos");

  const convos = await Convo.find({ users: mongoUser._id }).select('title').exec();

  if(!convos) {
    return res.status(404).json({
      success: false,
      message: 'Convos not found',
    });
  }

  return res.status(200).json({
    success: true,
    convos: convos,
  });
});

// Display detail page for a specific convo.
exports.convo_detail = asyncHandler(async (req, res, next) => {
  const mongoUser = await userInfoNoAPI(req.headers['x-user']);

  if (!mongoUser) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  const convo = await Convo.findById(req.params.id).populate(['messages', 'users']).exec();

  if(!convo) {
    return res.status(404).json({
      success: false,
      message: 'Convo not found',
    });
  }

  // Check if user is authorized to access this conversation
  for(let i = 0; i < convo.users.length; i++) {
    if(convo.users[i]._id.toString() == mongoUser._id.toString()) {
      if(convo.owner.toString() == mongoUser._id.toString()) {
        // console.log("Authorized owner");
        return res.status(200).json({
          success: true,
          convo: convo,
          owner: true,
          mongoId: mongoUser._id,
        });
      }
      // console.log("Authorized user");
      return res.status(200).json({
        success: true,
        convo: convo,
        mongoId: mongoUser._id,
      });
    }
  }

  return res.status(403).json({
    success: false,
    convo: 'You are not authorized to access this conversation',
  });
});

// Handle convo create on POST.
exports.convo_create_post = asyncHandler(async (req, res, next) => {
  console.log("Creating convo");
  const mongoUser = await userInfoNoAPI(req.headers['x-user']);

  if(!mongoUser) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized',
    });
  }

  const newConvo = new Convo({ 
    title: req.body.title,
    owner: mongoUser._id,
    messages: [],
    users: [mongoUser._id],
    date_created: DateTime.now().toJSDate(),
  });

  try {
    await newConvo.save();

    return res.status(201).json({
      success: true,
      message: 'Convo created successfully',
    });
  } catch (error) {
    console.error('Error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Error creating convo',
    });
  }
});

// Handle convo delete on DELETE.
exports.convo_delete = asyncHandler(async (req, res, next) => {
  const mongoUser = await userInfoNoAPI(req.headers['x-user']);

  if (!mongoUser) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  const convo = await Convo.findById(req.params.id).exec();
  if(!convo) {
    return res.status(404).json({
      success: false,
      message: 'Convo not found',
    });
  }

  if(convo.owner.toString() !== mongoUser._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'You are not authorized to delete this conversation',
    });
  }

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const messageCount = await Message.countDocuments({convo: convo._id}).exec();
    console.log(`There are ${messageCount} messages to delete`);
    if (messageCount > 0) {
      const deleteMessagesResult = await Message.deleteMany({convo: convo._id}).session(session).exec();
      if (deleteMessagesResult.deletedCount === 0) {
          throw new Error("Failed to delete messages");
      } else {
          console.log("Messages deleted");
      }
    }

    const deletedConvo = await Convo.findByIdAndDelete(req.params.id).session(session).exec();
    if (!deletedConvo) {
        console.log("Failed to delete Convo");
    } else {
        console.log("Convo deleted");
    }

    await session.commitTransaction();
    session.endSession();
  } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.error("Error deleting convo and messages:", error);
      return res.status(500).json({
          success: false,
          message: 'Error deleting convo and messages',
      });
  }
  
  return res.status(200).json({
    success: true,
    message: 'Convo deleted successfully',
  });
});

// Handle convo update on PUT.
exports.convo_title_update = asyncHandler(async (req, res, next) => {
  const mongoUser = await userInfoNoAPI(req.headers['x-user']);

  if (!mongoUser) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  const convo = await Convo.findById(req.params.id).exec();

  if(!convo) {
    return res.status(404).json({
      success: false,
      message: 'Convo not found',
    });
  }

  const isMember = convo.users.some(user => user.toString() === mongoUser._id.toString());

  if(!isMember) {
    return res.status(403).json({
      success: false,
      message: 'You are not authorized to update this conversation',
    })
  }

  let updatedTitle = req.body.title;
  if (!updatedTitle.endsWith(" (edited)")) {
      updatedTitle += " (edited)";
  }
  
  const updatedConvo = await Convo.findByIdAndUpdate(req.params.id, { title: updatedTitle }).exec();
  if(!updatedConvo) {
    return res.status(500).json({
      success: false,
      message: 'Error updating convo title',
    });
  } else {
    return res.status(201).json({
      success: true,
      message: 'Convo title updated successfully',
    });
  }
});

// Handle convo user add on PUT.
exports.convo_add_friend = asyncHandler(async (req, res, next) => {
  const mongoUser = await userInfoNoAPI(req.headers['x-user']);

  if (!mongoUser) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  const friendEmail = req.body.username;
  const friend = await User.findOne({ email: friendEmail }).exec();

  if (!friend) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  if (friendEmail === mongoUser.email) {
    return res.status(409).json({
      success: false,
      message: "Cannot add yourself to the convo",
    });
  }

  // Convert friend._id to string once, to avoid repeated conversions
  const friendIdStr = friend._id.toString();

  // Check if the friend is in the user's friend list
  const isFriend = mongoUser.friends.some(friend => friend.toString() === friendIdStr);

  if (!isFriend) {
    return res.status(403).json({
      success: false,
      message: "User is not a friend",
    });
  }

  const convoId = req.params.id;
  const convo = await Convo.findById(convoId).populate('users').exec();

  if (!convo) {
    return res.status(404).json({
      success: false,
      message: "Convo not found",
    });
  }

    // Check if the friend is already in the conversation
    const isAlreadyInConvo = convo.users.some(user => user._id.toString() === friendIdStr);

    if (isAlreadyInConvo) {
      return res.status(403).json({
        success: false,
        message: "The user has already been added to the conversation",
      });
    }
    

    try {
      // If the friend is not already in the conversation, add them
      convo.users.push(friend._id);
      await convo.save();

      return res.status(201).json({
        success: true,
        message: "Friend added to the conversation",
      });
    } catch (error) {
      console.error("Error adding friend to convo:", error);
      return res.status(500).json({
        success: false,
        message: "Error adding friend to convo",
      });
    } 
});

// Handle convo user remove on PUT.
exports.convo_remove_friend = asyncHandler(async (req, res, next) => {
  const mongoUser = await userInfoNoAPI(req.headers['x-user']);

  if (!mongoUser) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  const friendEmail = req.body.username;
  const friend = await User.findOne({ email: friendEmail }).exec();

  if (!friend) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  // Convert friend._id to string once, to avoid repeated conversions
  const friendIdStr = friend._id.toString();

  const convoId = req.params.id;
  const convo = await Convo.findById(convoId).populate('users').exec();

  if (!convo) {
    return res.status(404).json({
      success: false,
      message: "Convo not found",
    });
  }

    // Check if the friend is in the conversation
    const isInConvo = convo.users.some(user => user._id.toString() === friendIdStr);

    if (!isInConvo) {
      return res.status(403).json({
        success: false,
        message: "This user is not in the conversation",
      });
    }

    if(friendEmail === mongoUser.email) {
      return res.status(409).json({
        success: false,
        message: "Cannot remove yourself from the convo. Use delete button.",
      });
    }

    try {
      convo.users.pull(friend._id);
      await convo.save();

      return res.status(201).json({
        success: true,
        message: "Friend removed from the conversation",
      });
    } catch (error) {
      console.error("Error removing friend from convo:", error);
      return res.status(500).json({
        success: false,
        message: "Error removing friend from convo",
      });
    }
    
});

exports.convo_leave = asyncHandler(async (req, res, next) => {
  const mongoUser = await userInfoNoAPI(req.headers['x-user']);

  if (!mongoUser) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  const convoId = req.params.id;
  const convo = await Convo.findById(convoId).populate('users').exec();

  if (!convo) {
    return res.status(404).json({
      success: false,
      message: "Convo not found",
    });
  }

  if (convo.owner.toString() === mongoUser._id.toString()) {
    return res.status(403).json({
      success: false,
      message: "Owner cannot leave the conversation",
    });
  }

  const isInConvo = convo.users.some(user => user._id.toString() === mongoUser._id.toString());

  if (!isInConvo) {
    return res.status(403).json({
      success: false,
      message: "You are not in the conversation",
    });
  }


  try {
    convo.users.pull(mongoUser._id);
    await convo.save();

    return res.status(201).json({
      success: true,
      message: "You have left the conversation",
    });
  } catch (error) {
    console.error("Error leaving convo:", error);
    return res.status(500).json({
      success: false,
      message: "Error leaving convo",
    });
  }
});
const Convo = require("../models/convo");
const User = require("../models/user");
const { DateTime } = require("luxon");
const asyncHandler = require("express-async-handler");
const getUserInfo = require("../utils/getUserInfo");

// Display list of all convos.
exports.convo_list = asyncHandler(async (req, res, next) => {
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

  const convo = await Convo.findById(req.params.id).populate('messages').exec();

  if(!convo) {
    return res.status(404).json({
      success: false,
      message: 'Convo not found',
    });
  }

  // Check if user is authorized to access this conversation
  for(let i = 0; i < convo.users.length; i++) {
    if(convo.users[i].toString() == mongoUser._id.toString()) {
      // console.log("Authorized user");
      return res.status(200).json({
        success: true,
        convo: convo,
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
  // Parse the 'X-User' header to get the user object
  const user = JSON.parse(req.headers['x-user']);
  const userId = user.sub;
  const mongoUser = await User.findOne({ auth0id: userId }).exec(); // MongoDB user

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

  await newConvo.save();

  return res.status(201).json({
    success: true,
    message: 'Convo created successfully',
  });
});

// Handle convo delete on DELETE.
exports.convo_delete = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Convo DELETE");
});

// Handle convo update on PUT.
exports.convo_title_update = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Convo update PUT");
});

// Handle convo user add on PUT.
exports.convo_user_add = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Convo user add PUT");
});

// Handle convo user remove on PUT.
exports.convo_user_remove = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Convo user remove PUT");
});

const User = require("../models/user");
const jwt = require('jsonwebtoken');
const asyncHandler = require("express-async-handler");

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
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.includes(' ')) {
        throw new Error('Invalid authorization header');
    }
    const accessToken = authHeader.split(" ")[1];
    const decodedToken = jwt.decode(accessToken);
    const userId = decodedToken.sub;
    const username = decodedToken.nickname;

    const userExists = await User.findOne({ auth0id: userId }).exec();

    if(userExists) {
      res.status(409).send('User already registered');
      return;
    }

    const newUser = new User({ 
      auth0id: userId,
      username: username,
      friends: [],
     });
    await newUser.save();

    res.status(201).send('User registered successfully');
    } catch (error) {
        console.log('Error:', error.message);
        res.status(500).send('Error registering user');
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
  res.send("NOT IMPLEMENTED: User friends GET");
});

// Handle add user friend on PUT.
exports.user_friend_add = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: User friend add PUT");
});

// Handle remove user friend on PUT.
exports.user_friend_remove = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: User friend remove PUT");
});
const User = require("../models/user");
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

// Handle user update information on PUT.
exports.user_update = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: User update PUT");
});

// AUTHENTICATION REQUIRED CONTROLLERS //

// Handle user create on POST.
exports.user_create_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: User create POST");
  });

// Handle user login on POST.
exports.user_login_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: User login POST");
});

// Handle user logout on POST.
exports.user_logout_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: User logout POST");
});

// Handle user password change on POST.
exports.user_password_change_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: User password change POST");
});

// Handle user delete on DELETE.
exports.user_delete = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: User DELETE");
});
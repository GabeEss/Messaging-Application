const Message = require("../models/message");
const { DateTime } = require("luxon");
const asyncHandler = require("express-async-handler");
const getUserInfo = require("../utils/getUserInfo");

// Display list of all messages.
exports.message_list = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Message list");
});

// Display detail page for a specific message.
exports.message_detail = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Message detail: ${req.params.id}`);
});

// Handle message create on POST.
exports.message_create_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Message create POST");
});

// Handle message delete on DELETE.
exports.message_delete = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Message DELETE");
});

// Handle message update on PUT.
exports.message_update = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Message update PUT");
});
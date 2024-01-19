const Convo = require("../models/convo");
const asyncHandler = require("express-async-handler");

// Display list of all convos.
exports.convo_list = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Convo list");
});

// Display detail page for a specific convo.
exports.convo_detail = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Convo detail: ${req.params.id}`);
});

// Handle convo create on POST.
exports.convo_create_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Convo create POST");
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

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

// Display convo create form on GET.
exports.convo_create_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Convo create GET");
});

// Handle convo create on POST.
exports.convo_create_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Convo create POST");
});

// Display convo delete form on GET.
exports.convo_delete_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Convo delete GET");
});

// Handle convo delete on POST.
exports.convo_delete_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Convo delete POST");
});

// Display convo update form on GET.
exports.convo_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Convo update GET");
});

// Handle convo update on POST.
exports.convo_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Convo update POST");
});

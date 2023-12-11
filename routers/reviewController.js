const { Router } = require("express");
const { isValidObjectId } = require("mongoose");
const { Review } = require("../models/review");

const reviewRouter = Router();
// 6번 별점 작성
// addComment(guestId, reserveId, star, comment);

module.exports = reviewRouter;

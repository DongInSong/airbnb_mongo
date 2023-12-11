const { Router } = require("express");
const { isValidObjectId } = require("mongoose");
const { Guest } = require("../models/guest");
const { House } = require("../models/house");

const guestRouter = Router();

guestRouter.get("/allGuests", async(req, res) => {
  const guests = await Guest.find({});
  return res.send({ guests });
})

// 5번 마이페이지
// reservationHistory(guestId, FindType.ALL);
// reservationHistory(guestId, FindType.ONCOMING);
// reservationHistory(guestId, FindType.TERMINATED);

module.exports = guestRouter;

const { Router } = require("express");
const { isValidObjectId } = require("mongoose");
const { House, Review, Reservation } = require("../models");
const houseRouter = Router();

// 1번 숙소 조회
// findHouse(checkinDate, checkoutDate, people, houseType);

houseRouter.get("/findHouse/:checkin/:checkout/:people/:houseType", async (req, res) => {
  const { checkin, checkout, people, houseType } = req.params;

  try {
    console.log("/findHouse/", checkin, checkout, people, houseType);
    const houses = await House.find({
      "acceptanceInfo.people": { $gte: people },
      houseType: houseType || { $ne: null },
      $or: [
        { "reservation.checkin": { $not: { $gte: checkin, $lte: checkout } } },
        { "reservation.checkout": { $not: { $gte: checkin, $lte: checkout } } },
      ],
    })
      .sort({ "cost.weekdays": "asc" })
      .populate("reviews");
    res.json(houses);
  } catch (error) {
    console.error("Error fetching houses:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// 2번 상세 조회
// houseDetail(houseId, month);
houseRouter.get("/houseDetail/:houseId", async (req, res) => {
  const { houseId } = req.params;
  try {
    if (!isValidObjectId(houseId)) {
      return res.status(400).send({ error: "houseId is invalid" });
    }
    const house = await House.findById(houseId).populate("reviews");
    let allReservation = [];
    for (const reserveId of house.reservations) {
      const reservations = await Reservation.findById(reserveId);
      allReservation.push(reservations);
    }
    let result = [];
    result.push(house);
    result.push(allReservation);
    res.json(result);
  } catch (error) {
    console.error("Error fetching houses:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

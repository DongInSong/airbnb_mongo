const { Router } = require("express");
const { isValidObjectId } = require("mongoose");
const { Reservation } = require("../models/reservation");
const { House, Guest } = require("../models");

const reservRouter = Router();

// 3번 예약
reservRouter.post("/bookHouse/:houseId/:guestId/:checkin/:checkout/:people", async (req, res) => {
  const { houseId, guestId, checkin, checkout, people } = req.params;
  try {
    console.log("/bookHouse/", houseId, guestId, checkin, checkout, people);

    if (!isValidObjectId(houseId)) {
      return res.status(400).send({ error: "houseId is invalid" });
    }
    if (!isValidObjectId(guestId)) {
      return res.status(400).send({ error: "guestId is invalid" });
    }

    const house = await House.findById(houseId);
    const guest = await Guest.findById(guestId);
    const reservation = new Reservation({
      time: {
        checkin: checkin,
        checkout: checkout,
      },
      numOfPeople: parseInt(people),
      house: houseId,
      guest: guestId,
    });
    reservation.save();
    house.reservations.push(reservation._id);
    house.save();
    guest.reservations.push(reservation._id);
    guest.save();
    res.json(reservation);
  } catch (error) {
    console.error("Error fetching houses:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// 4번 예약 취소
reservRouter.delete("/cancelReserve/:reserveId", async (req, res) => {
  const { reserveId } = req.params;
  try {
    console.log("/cancelReserve/", reserveId);

    if (!isValidObjectId(reserveId)) {
      return res.status(400).send({ error: "reserveId is invalid" });
    }

    const reservation = await Reservation.findById(reserveId);
    const guest = await Guest.findByIdAndUpdate(reservation.guest, { $pull: { reservations: reserveId } });
    guest.save();
    const house = await House.findByIdAndUpdate(reservation.house, { $pull: { reservations: reserveId } });
    house.save();
    await reservation.deleteOne({ _id: reserveId });
  } catch (error) {
    console.error("Error fetching houses:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = reservRouter;

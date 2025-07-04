const { Router } = require("express");
const { isValidObjectId } = require("mongoose");
const { Reservation } = require("../models/reservation");
const { House, Guest } = require("../models");

const reservRouter = Router();

// 3번 예약
reservRouter.post("/bookHouse/:houseId/:guestId/:checkin/:checkout/:people", async (req, res) => {
  const { houseId, guestId, checkin, checkout, people } = req.params;
  try {
    if (!isValidObjectId(houseId)) {

    const house = await House.findById(houseId);
    const guest = await Guest.findById(guestId);

    let allReservation = [];
    for (const reserveId of house.reservations) {
      const reservations = await Reservation.findById(reserveId);
      allReservation.push(reservations);
    }
    if (house.houseType === "WHOLE") {
      if (checkRoom(checkin, checkout, getBookedDates(allReservation))) {
        return res.status(400).send("The room is not enough.");
      } else {
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
      }
    } else {
      let isAvailable = true;
      let dateCountMap = countDates(getBookedDates(allReservation));
      let currentRoom = house.acceptanceInfo.room;
      const checkin_localDate = new Date(checkin);
      const checkout_localDate = new Date(checkout);

      while (checkin_localDate <= checkout_localDate) {
        for (const [date, count] of dateCountMap.entries()) {
          const entryDate = new Date(date);
          if (checkin_localDate.toISOString() === entryDate.toISOString()) {
            if (currentRoom - count === 0) {
              isAvailable = false;
            }
          }
        }
        checkin_localDate.setDate(checkin_localDate.getDate() + 1);
      }

      if (!isAvailable) {
        return res.status(400).send("The room is not enough");
      } else {
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
      }
    }
  } catch (error) {
    console.error("Error fetching houses:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// 4번 예약 취소
reservRouter.delete("/cancelReserve/:reserveId", async (req, res) => {
  const { reserveId } = req.params;
  try {
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

function checkRoom(checkin, checkout, bookedDates) {
  if (isInArray(bookedDates, new Date(checkin))) {
    return true;
  }
  if (isInArray(bookedDates, new Date(checkout))) {
    return true;
  }
  return false;
}

function getBookedDates(res) {
  let checkin = null;
  let checkout = null;
  const totalDates = [];

  for (let i = 0; i < res.length; i++) {
    checkin = new Date(res[i].time.checkin);
    checkout = new Date(res[i].time.checkout);
    while (checkin <= checkout) {
      totalDates.push(new Date(checkin));
      checkin.setDate(checkin.getDate() + 1);
    }
  }
  totalDates.sort((a, b) => a - b);
  return totalDates;
}

function isInArray(array, value) {
  return !!array.find((item) => {
    return item.getTime() == value.getTime();
  });
}

function countDates(dates) {
  let dateCountMap = new Map();
  dates.forEach((date) => {
    date.setHours(0, 0, 0, 0);
    const dateString = date.toISOString();
    dateCountMap.set(dateString, (dateCountMap.get(dateString) || 0) + 1);
  });
  return dateCountMap;
}

module.exports = reservRouter;

const { Router } = require("express");
const { isValidObjectId } = require("mongoose");
const { Guest, Reservation, Review, House } = require("../models");

const reviewRouter = Router();

// 6번 별점 작성
reviewRouter.post("/addComment/:guestId/:reserveId/:star/:comment", async (req, res) => {
  const { guestId, reserveId, star, comment } = req.params;

  try {
    const reservation = await Reservation.findById(reserveId);
    const guest = await Guest.findById(guestId).populate("reservations").populate("reviews");

    if (!reservation || !guest) {
      return res.status(404).send("Reservation or guest not found.");
    }

    if (!await isCheckedOut(guest, reserveId)) {
      return res.status(400).send("The guest has not checked out.");
    }

    if (isExistReview(guest, reserveId)) {
      return res.status(400).send("A review has already been written for this reservation.");
    }

    const review = new Review({ star, comment, guest, house: reservation.house, reservation });
    await review.save();
    const house = await House.findById(review.house);
    house.reviews.push(review._id);
    house.save();
    guest.reviews.push(review._id);
    guest.save();

    res.status(200).send("Review added successfully.");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error.");
  }
});

async function isCheckedOut(guest, reserveId) {
  const allReservations = guest.reservations;
  const checkoutDates = await Promise.all(
    allReservations.map(async (reservation) => {
      const checkout_localDate = new Date(reservation.time.checkout);
      return { id: reservation._id, checkoutDate: checkout_localDate };
    })
  );

  for (const { id, checkoutDate } of checkoutDates) {
    if (reserveId && id && id.toString() === reserveId.toString()) {
      if (new Date() >= new Date(checkoutDate)) {
        return true;
      }
    }
  }

  return false;
}

function isExistReview(guest, reserveId) {
  for (reviewReserve of guest.reviews) {
    if (reserveId && reviewReserve.reservation && reviewReserve.reservation.toString() === reserveId.toString()) {
      return true;
    }
  }
  return false;
}

module.exports = reviewRouter;

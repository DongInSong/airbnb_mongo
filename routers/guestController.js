const { Router } = require("express");
const { isValidObjectId } = require("mongoose");
const { Guest, House, Review } = require("../models");
const reservRouter = require("./reservationController");

const guestRouter = Router();

guestRouter.get("/allGuests", async (req, res) => {
  const guests = await Guest.find({});
  return res.send({ guests });
});

// 5번 마이페이지
guestRouter.get("/myPage/:guestId/:type", async (req, res) => {
  const { guestId, type } = req.params;
  try {
    console.log("/myPage/", guestId);

    if (!isValidObjectId(guestId)) {
      return res.status(400).send({ error: "guestId is invalid" });
    }
    const guest = await Guest.findById(guestId).populate("reviews").populate("reservations");
    const allReservation = guest.reservations;
    console.log(allReservation.length);
    let result = [];
    if (allReservation.length === 0) {
      title = "숙박 내역이 없습니다.";
      result.push(title);
    } else {
      let checkin_localDate = null;
      let checkout_localDate = null;
      let isReviewed = "X";
      let title = null;
      const reservationsWithHouseInfo = [];
      switch (type) {
        case "ALL":
          title = "[모든 리스트]";
          for (const reservation of allReservation) {
            if (isExistReview(guest, reservation._id)) {
              isReviewed = "O";
            } else isReviewed = "X";
            const house = await House.findById(reservation.house);
            if (house) {
              reservationsWithHouseInfo.push({
                reservationId: reservation._id,
                houseName: house.name,
                checkin: reservation.time.checkin,
                checkout: reservation.time.checkout,
                review: isReviewed,
              });
            }
          }
          break;
        case "ONCOMING":
          title = "[예약 리스트]";
          for (const reservation of allReservation) {
            if (isExistReview(guest, reservation._id)) {
              isReviewed = "O";
            } else isReviewed = "X";
            checkin_localDate = new Date(reservation.time.checkin);
            if (new Date() <= checkin_localDate) {
              const house = await House.findById(reservation.house);
              const review = await Review.findById(reservation._id);
              if (review) {
                isReviewed = "O";
              }
              if (house) {
                reservationsWithHouseInfo.push({
                  reservationId: reservation._id,
                  houseName: house.name,
                  checkin: reservation.time.checkin,
                  checkout: reservation.time.checkout,
                  review: isReviewed,
                });
              }
            }
          }
          break;
        case "TERMINATED":
          title = "[숙박 완료 리스트]";
          for (const reservation of allReservation) {
            if (isExistReview(guest, reservation._id)) {
              isReviewed = "O";
            } else isReviewed = "X";
            checkout_localDate = new Date(reservation.time.checkout);
            if (new Date() >= checkout_localDate) {
              const house = await House.findById(reservation.house);
              const review = await Review.findById(reservation._id);
              if (review) {
                isReviewed = "O";
              }
              if (house) {
                reservationsWithHouseInfo.push({
                  reservationId: reservation._id,
                  houseName: house.name,
                  checkin: reservation.time.checkin,
                  checkout: reservation.time.checkout,
                  review: isReviewed,
                });
              }
            }
          }
          break;
      }
      result.push(title);
      reservationsWithHouseInfo.sort((a, b) => a.checkin - b.checkin);
      result.push(reservationsWithHouseInfo);
    }
    res.json(result);
  } catch (error) {
    console.error("Error fetching houses:", error);
  }
});

function isExistReview(guest, reserveId) {
  for (reviewReserve of guest.reviews) {
    if (reserveId && reviewReserve.reservation && reviewReserve.reservation.toString() === reserveId.toString()) {
      return true;
    }
  }
  return false;
}

module.exports = guestRouter;

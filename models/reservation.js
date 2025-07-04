const { Schema, model, Types } = require("mongoose");

const ReservationSchema = new Schema(
  {
    time: { checkin: Date, checkout: Date },
    numOfPeople: Number,
    house: { type: Types.ObjectId, required: true, ref: "House" },
    guest: { type: Types.ObjectId, required: true, ref: "Guest" },
  },
  { timestamps: true }
);

const Reservation = model("Reservation", ReservationSchema);

module.exports = { Reservation };

const { Schema, model, Types} = require("mongoose");

const ReviewSchema = new Schema(
  {
    comment: { type: String, required: true },
    star: { type: Number, required: true },
    house: { type: Types.ObjectId, required: true, ref: "House" },
    guest: { type: Types.ObjectId, required: true, ref: "Guest" },
    reservation: { type: Types.ObjectId, ref: "Reservation" },
  },
  { timestamps: true }
);

const Review = model("Review", ReviewSchema);

module.exports = { Review };

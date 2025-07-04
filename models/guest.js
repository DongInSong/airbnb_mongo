const { Schema, model, Types } = require("mongoose");

const GuestSchema = new Schema(
  {
    name: { type: String, required: true },
    address: { city: String, street: String, zipCode: String },
    reservations: [{ type: Types.ObjectId, ref: "Reservation" }],
    reviews: [{ type: Types.ObjectId, ref: "Review" }],
  },
  { timestamps: true }
);

const Guest = model("Guest", GuestSchema);

module.exports = { Guest };

const { Schema, model, Types } = require("mongoose");

const HouseSchema = new Schema(
  {
    name: { type: String, required: true },
    address: { city: String, street: String, zipCode: String },
    houseType: { type: String, enum: ["PERSONAL", "WHOLE"], default: "PERSONAL" },
    acceptanceInfo: { room: Number, bath: Number, people: Number },
    facility: { basic: String, preference: String, safety: String, accessibility: String },
    cost: { weekdays: Number, weekend: Number },
    reservations: [{ type: Types.ObjectId, ref: "Reservation" }],
    reviews: [{ type: Types.ObjectId, ref: "Review" }],
  },
  { timestamps: true }
);

const House = model("House", HouseSchema);

module.exports = { House };

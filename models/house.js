const { Schema, model, Types } = require("mongoose");

const HouseSchema = new Schema(
  {
    name: { type: String, required: true },
    address: { city: String, street: String, zipCode: String },
    houseType: { type: String, enum: ["PERSONAL", "WHOLE"], default: "PERSONAL" },
    acceptanceInfo: { room: Number, bath: Number, people: Number },
    facility: { basic: String, preference: String, safety: String, accessibility: String },
    cost: { weekdays: Number, weekend: Number },
    reservation: { type: Types.ObjectId, required: true, ref: "Reservation" },
  },
  { timestamps: true }
);

const House = model("House", HouseSchema);

module.exports = { House };

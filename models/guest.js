const { Schema, model } = require("mongoose");

const GuestSchema = new Schema(
  {
    name: { type: String, required: true },
    age: Number,
    address: { city: String, street: String, zipCode: String },
  },
  { timestamps: true }
);

const Guest = model("Guest", GuestSchema);

module.exports = { Guest };

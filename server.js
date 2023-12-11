const express = require("express");
const mongoose = require("mongoose");
const guestController = require("./routers/guestController");
const houseController = require("./routers/houseController");
const reservationController = require("./routers/reservationController");
const reviewController = require("./routers/reviewController");
const { generateDummyData } = require("./faker/faker.js");

const app = express();
const hostname = "127.0.0.1";
const port = 3000;

const DB_URI = "mongodb://127.0.0.1:27017/testdb";

const server = async () => {
  try {
    await mongoose.connect(DB_URI);
    // generateDummyData(5, 10);
    app.use(express.json());
    app.use(guestController);
    app.use(houseController);
    app.use(reservationController);
    app.use(reviewController);
    app.listen(port, hostname, function () {
      console.log(`server is running http://${hostname}:${port}`);
    });
  } catch (err) {
    console.log(err);
  }
};
server();

app.get("/", function (req, res) {
  return res.send("hello worlds");
});

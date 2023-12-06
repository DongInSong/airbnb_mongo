const express = require("express");
const mongoose = require("mongoose");
const memberController = require("./routers/memberController");
const blogController = require("./routers/blogController");
const app = express();
const hostname = "127.0.0.1";
const port = 3000;

const DB_URI = "mongodb://127.0.0.1:27017/testdb";

const server = async () => {
  try {
    await mongoose.connect(DB_URI);
    app.use(express.json());
    app.use(memberController);
    app.use("/blog", blogController);
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

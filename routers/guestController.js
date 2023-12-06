const { Router } = require("express");
const { isValidObjectId } = require("mongoose");
const { House } = require("../models/house");

const guestRouter = Router();

guestRouter.get("/findHouse", async(req, res) => {
    const { date, houseType, people, room } = req.body;
    const houses = await House.find({}).find({ houseType: {$eq: houseType}});
    return res.send({ houses })
})
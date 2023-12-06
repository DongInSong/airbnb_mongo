const express = require("express");
const router = express.Router();
const { Member } = require("../models/member");

router.post("/member", async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).send({ error: "name is required" });
    const member = new Member(req.body);
    await member.save();
    return res.send({ member });
  } catch (error) {
    return res.status(400).send({ error: error.message });
  }
});

router.get("/member", async (req, res) => {
  const members = await Member.find({});
  return res.send({ members });
});

router.get("/member-v2", async (req, res) => {
  const { age } = req.query;
  const members = await Member.find({}).find({ age: { $gte: age } });
  return res.send({ members });
  // http://localhost:3000/member-v2?age=25
});

router.get("/member-v3/:age", async (req, res) => {
  const { age } = req.params;
  const members = await Member.find({}).find({ age: { $gte: age } });
  return res.send({ members });
  // http://localhost:3000/member-v3/25
});

router.get("/member-v4/:memberId", async (req, res) => {
  const { memberId } = req.params;
  const members = await Member.findById(memberId);
  return res.send({ members });
  // http://localhost:3000/member-v4/65556126c61e34f88b27ee47
});

router.put("/member/:memberId", async (req, res) => {
  const { memberId } = req.params;
  const { age } = req.body;
  const members = await Member.updateOne({ _id: memberId }, { age: age });
  return res.send({ members });
  // http://localhost:3000/member/65556126c61e34f88b27ee47
  // body raw JSON {"age" : 55}
  // return : 결과
});

router.put("/member-v2/:memberId", async (req, res) => {
  const { memberId } = req.params;
  const { age } = req.body;
  const members = await Member.findByIdAndUpdate(memberId, { age: age }, { new: true });
  return res.send({ members });
  // http://localhost:3000/member-v2/65556126c61e34f88b27ee47
  // body raw JSON {"age" : 20}
  // return : 업데이트된 회원 정보
});

module.exports = router;

const { Router } = require("express");
const { Blog } = require("../models/blog");
const { Member } = require("../models/member");
const { isValidObjectId } = require("mongoose");
const commentRouter = require("./commentController");

const router = Router();
router.use("/:blogId/comment", commentRouter);

router.post("/", async (req, res) => {
  try {
    const { title, content, memberId } = req.body;
    if (!isValidObjectId(memberId)) {
      res.status(400).send({ error: "memberId is invalid" });
    }
    let member = await Member.findById(memberId);
    if (!member) {
      res.status(400).send({ error: "member dosen't exist" });
    }
    let blog = new Blog({ ...req.body, member: member.toObject() }); // ...req.body확산 연산자?
    await blog.save();
    return res.send({ blog });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
});

router.get("/:blogId", async (req, res) => {
  try {
    let { blogId } = req.params;
    const blog = await Blog.findById(blogId);
    return res.send({ blog });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
});

router.post("/:blogId", async (req, res) => {
  let { blogId } = req.params;
  let { title, content } = req.body;
  try {
    const blog = await Blog.findByIdAndUpdate(blogId, {
      title: title,
      content: content,
    });
    if (!blog) {
      res.status(400).send("invalid request");
    }
    return res.send(blog);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;

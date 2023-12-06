const { Router } = require("express");
const commentRouter = Router({ mergeParams: true }); // 특정 라우터에서 소속되어있음을 true
const { Comment } = require("../models/comment");
const { isValidObjectId } = require("mongoose");
const { Blog } = require("../models/blog");
const { Member } = require("../models/member");

commentRouter.post("/", async (req, res) => {
  try {
    const { blogId } = req.params;
    const { content, memberId } = req.body;
    if (!isValidObjectId(blogId)) {
      return res.status(400).send({ error: "blog id is invalid" });
    }
    if (!isValidObjectId(memberId)) {
      return res.status(400).send({ error: "member id is invalid" });
    }

    const blog = await Blog.findById(blogId);
    const member = await Member.findById(memberId);
    if (!blog || !member) {
      return res.status(400).send({ error: "blog or member dose not exist" });
    }

    const comment = new Comment({content, member, blog});
    comment.save();
    return res.send({comment});

  } catch (error) {}
});

module.exports = commentRouter;

const express = require("express");
const  checkUserRole = require("../middleware/roles");
const ContentPost = require("../model/content");

const contentRouter = express.Router();


contentRouter.post("/content", checkUserRole(["admin", "editor"]), async (req, res) => {
  
  const content = req.body;
console.log(content);
  try {
    content.owner = req.userId;
    const newContent = new ContentPost(content);
    const response = await newContent.save();
    if (response) {
      res.status(201).send({ message: "post created successfully" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: true, message: "Internal Server error" });
  }
});


contentRouter.get("/view",checkUserRole(["admin", "editor", "viewer"]), async (req, res) => {


  const userId = req.userId;
   console.log(userId);

 try {
    const content = await ContentPost.find({ owner: userId });
    console.log("content", content);
    res.send({
      message: "post returned successfully",
      content: content,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: true, message: "Internal Server error" });
  }
});


contentRouter.get("/view/:id", checkUserRole(["admin", "editor", "viewer"]), async (req, res) => {
  const id = req.params.id;
  const userId = req.userId;
  console.log(userId);
  try {
    const content = await ContentPost.findOne({ _id: id, owner: userId });
    if (content) {
      res.status(201).send({ message: "post returned successfully", content });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: true, message: "Internal Server error" });
  }
});

contentRouter.put("/:id", checkUserRole(["admin", "editor"]), async (req, res) => {
  const id = req.params.id;
  const content = req.body;
const userId = req.userId;

  //console.log(content);
  console.log(userId);

  // Add input validation
  if (!content ||!content.title ||!content.description) {
    return res.status(400).send({ error: true, message: "Missing required fields" });
  }

  try {
    // Add authentication
    // if (!req.userId) {
    //   console.log(userId);
    //   return res.status(401).send({ error: true, message: "Unauthorized" });
    // }

    // Add optimistic locking
    const existingContent = await ContentPost.findOne({ _id: id, owner: req.userId });
    if (!existingContent) {
      return res.status(404).send({ error: true, message: "Post not found" });
    }
    if (existingContent.version!== content.version) {
      return res.status(409).send({ error: true, message: "Conflict" });
    }

    // Update the content post
    existingContent.title = content.title;
    existingContent.description = content.description;
    existingContent.version = content.version + 1;
    const response = await existingContent.save();

    if (response) {
      res.status(200).send({ message: "post updated successfully" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: true, message: "Internal Server error" });
  }
});



contentRouter.delete("/:id", checkUserRole(["admin", "editor"]), async (req, res) => {
  const id = req.params.id;
  const userId = req.userId;
  console.log(id)

  try {
    const content = await ContentPost.findOneAndDelete({
      _id: id,
      owner: userId,
    });
    if (content) {
     res.status(201).send({ message: "Post deleted successfully", content });
    }

    } catch (error) {
    console.log(error);
    res.status(500).send({ error: true, message: "Internal Server error" });
  }
});

module.exports = contentRouter;
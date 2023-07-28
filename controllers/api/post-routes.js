const router = require("express").Router();
const { User, Comment, Post } = require("../models");
// Import the custom middleware
const withAuth = require("../utils/auth");

// get all posts with associated username
router.get("/", async (req, res) => {
  try {
    const dbpostData = await Post.findAll({
      include: [{ model: User, attributes: ["username"] }],
    });
    res.status(200).json(dbpostData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get one post by ID with associated username and comments
router.get("/post/:id", withAuth, async (req, res) => {
  try {
    const dbPostData = await Post.findByPk(req.params.id, {
      include: [
        { model: User, attributes: ["username"] },
        {
          model: Comment,
          include: [{ model: User, attributes: ["username"] }],
        },
      ],
    });

    const post = dbPostData.get({ plain: true });

    if (!post) {
      res.status(404).json({ message: "No post found with that id!" });
      return;
    }
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Create a new post with authenticated user
router.post("/", withAuth, async (req, res) => {
  try {
    // create a new post
    const newPost = await Post.create({
      ...req.body,
      post_user: req.session.post_user,
    });

    // send a response to the client
    res.status(200).json(newPost);
  } catch (err) {
    // error handling
    res.status(500).json(err);
  }
});

// Update an existing post with authenticated user
router.put("/:id", withAuth, async (req, res) => {
  try {
    const updatedPost = await Post.update(req.body, {
      where: { id: req.params.id },
    });

    if (!updatedPost) {
      res.status(404).json({ message: "No post found with that id!" });
      return;
    }
    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});
// Delete a post with authenticated user
router.delete("/post/:id", withAuth, async (req, res) => {
  try {
    // Delete all comments related to the post
    await Comment.destroy({
      where: { post_id: req.params.id },
    });

    const deletedPost = await Post.destroy({
      where: { id: req.params.id },
    });
    if (!deletedPost) {
      res.status(404).json({ message: "No post found with that id!" });
      return;
    }
    res.status(200).json(deletedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});
// Export the router
module.exports = router;

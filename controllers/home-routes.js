const router = require("express").Router();
const { User, Comment, Post } = require("../models");
// Import the custom middleware
const withAuth = require("../utils/auth");

// GET all Posts for homepage
router.get("/", async (req, res) => {
  try {
    const dbPostData = await Post.findAll({
      include: [
        {
          model: User,
          attributes: ["username"],
        },
      ],
    });

    const post = dbPostData.map((post) => post.get({ plain: true }));

    res.render("homepage", {
      post,
      loggedIn: req.session.loggedIn,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// get all posts from a user for dashboard
router.get("/dashboard", withAuth, async (req, res) => {
  try {
    const dbPostData = await Post.findAll({
      // bringing in data from post user which is same as user id
      where: { post_user: req.session.post_user },
      include: [{ model: User, attributes: ["username"] }],
    });

    const post = dbPostData.map((post) => post.get({ plain: true }));

    res.render("dashboard", {
      post,
      loggedIn: req.session.loggedIn,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// new post page route
router.get("/newpost", async (req, res) => {
  if (req.session.loggedIn) {
    res.render("newpost");
    return;
  }
  res.redirect("/login");
});

// edit post page route
router.get("/editpost/:id", async (req, res) => {
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
    res.render("editpost", { ...post, loggedIn: req.session.loggedIn });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});
// GET one user
// Use the custom middleware before allowing the user to access the user
router.get("/user/:id", withAuth, async (req, res) => {
  try {
    const dbUserData = await User.findByPk(req.params.id, {
      include: [
        {
          model: Post,
          attributes: [
            "id",
            "title",
            "artist",
            "exhibition_date",
            "filename",
            "description",
          ],
        },
      ],
    });

    const user = dbUserData.get({ plain: true });
    res.render("user", { user, loggedIn: req.session.loggedIn });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// GET one Post
// Use the custom middleware before allowing the user to access the post
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

    res.render("post", { ...post, loggedIn: req.session.loggedIn });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// BECAUSE USER IS LOGGED IN WE JUST NEED ONE DASHBAORD PAGE
router.get("/dashboard", withAuth, async (req, res) => {
  try {
    // gotta find all posts by log ins user id
    const dbPostData = await Post.findAll({
      where: { user_id: req.session.user_id },
      include: [{ model: User, attributes: ["username"] }],
    });
    const post = dbPostData.map((post) => post.get({ plain: true }));

    res.render("dashboard", { post, loggedIn: req.session.loggedIn });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get("/login", (req, res) => {
  if (req.session.loggedIn) {
    res.redirect("/");
    return;
  }

  res.render("login");
});

router.get("/logout", (req, res) => {
  if (req.session.loggedIn) {
    res.redirect("/dashboard");
    return;
  }
  res.render("login");
});

module.exports = router;

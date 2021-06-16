const router = require("express").Router();
const sequelize = require("../config/connection");
const { Blog, User, Comment } = require("../models");

router.get("/", (req, res) => {
  Blog.findAll({
    attributes: ["id", "title", "blog_text", "created_at"],
    order: [["created_at", "ASC"]],
    include: [
      {
        model: Comment,
        attributes: ["id", "input_text", "blog_id", "user_id", "created_at"],
        include: { model: User, attributes: ["username"] },
      },
      { model: User, attributes: ["username"] },
    ],
  })
    .then((dbBlogData) => {
      const blogs = dbBlogData.map((blog) => blog.get({ plain: true }));
      res.render("landingpage", { blogs, loggedIn: req.session.loggedIn });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get("/blog/:id", (req, res) => {
  Blog.findOne({
    where: {
      id: req.params.id,
    },
    attributes: ["id", "title", "blog_text", "created_at"],
    order: [["created_at", "ASC"]],
    include: [
      {
        model: Comment,
        attributes: ["id", "input_text", "blog_id", "user_id", "created_at"],
        include: { model: User, attributes: ["username"] },
      },
      { model: User, attributes: ["username"] },
    ],
  })
    .then((dbBlogData) => {
      if (!dbBlogData) {
        res.status(404).json({ message: "No blog found with this id!" });
        return;
      }
      const blog = dbBlogData.get({ plain: true });
      res.render("single-blog", {
        blog,
        loggedIn: req.session.loggedIn,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get("/login", (req, res) => {
  if (req.session.loggedIn) {
    res.redirect("/");
    return;
  }
  res.render("login");
});

module.exports = router;

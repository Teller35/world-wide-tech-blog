const router = require("express").Router();
const sequelize = require("../config/connection");
const { Blog, User, Comment } = require("../models");
const authorization = require("../utils/auth");

router.get("/", authorization, (req, res) => {
  Blog.findAll({
    where: { user_id: req.session.user_id },
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
      res.render("dashboard", { blogs, loggedIn: true });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get("/edit/:id", authorization, (req, res) => {
  Blog.findByPk(req.params.id, {
    attributes: ["id", "title", "blog_text", "created_at"],
    include: [
      {
        model: Comment,
        attributes: ["id", "input_text", "user_id", "created_at"],
        include: { model: User, attributes: ["username"] },
      },
      { model: User, attributes: ["username"] },
    ],
  })
    .then((dbBlogData) => {
      if (dbBlogData) {
        const blog = dbBlogData.get({ plain: true });
        res.render("edit-blog", {
          blog,
          loggedIn: true,
        });
      } else {
        res.status(404).end();
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;

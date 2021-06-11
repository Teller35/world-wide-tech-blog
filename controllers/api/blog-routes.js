const router = require("express").Router();
const { Blog, User, Comment } = require("../../models");
const authorization = require("../../utils/auth");

router.get("/", (req, res) => {
  Blog.findAll({
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
    .then((dbBlogData) => res.json(dbBlogData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get("/:id", (req, res) => {
  Blog.findOne({
    where: {
      id: req.params.id,
    },
    // attributes: ['id', 'title', 'created_at'],
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
      if (!dbBlogData) {
        res.status(404).json({ message: "No blog found with that id!" });
        return;
      }
      res.json(dbBlogData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.post("/", authorization, (req, res) => {
  if (req.session) {
    Blog.create({
      title: req.body.title,
      blog_text: req.body.blog_text,
      user_id: req.body.user_id,
    })
      .then((dbBlogData) => res.json(dbBlogData))
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  }
});

router.delete("/:id", authorization, (req, res) => {
  if (req.session) {
    Blog.destroy({
      where: {
        id: req.params.id,
      },
    })
      .then((dbBlogData) => {
        if (!dbBlogData) {
          res.status(404).json({ message: "No blog found with that id!" });
          return;
        }
        res.json(dbBlogData);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  }
});

module.exports = router;

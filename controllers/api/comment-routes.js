const router = require("express").Router();
const sequelize = require("../../config/connection");
const { Comment } = require("../../models");
const authorization = require("../../utils/auth");

router.get("/", (req, res) => {
  Comment.findAll()
    .then((dbCommData) => res.json(dbCommData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.post("/", authorization, (req, res) => {
  if (req.session) {
    Comment.create({
      input_text: req.body.input_text,
      user_id: req.session.user_id,
      blog_id: req.body.blog_id,
    })
      .then((dbCommData) => res.json(dbCommData))
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  }
});

router.delete("/:id", authorization, (req, res) => {
  if (req.session) {
    Comment.destroy({
      where: {
        id: req.params.id,
      },
    })
      .then((dbCommData) => {
        if (!dbCommData) {
          res.status(404).json({ message: "No comment found with this id!" });
          return;
        }
        res.json(dbCommData);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  }
});

module.exports = router;

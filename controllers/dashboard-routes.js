const  router = require('express').Router();
const { Blog, User, Comment } = require('../models');

router.get('/', (req, res) => {
    Blog.findAll({
        attributes: ['id', 'title', 'blog_text','created_at'],
        order: [['created_at', 'ASC']],
        include: [
          {
            model: Comment,
            attributes: ["id", "input_text", "user_id", "created_at"],
            include: { model: User, attributes: ["username"] },
          },
          { model: User, attributes: ["username"] },
        ],
      })
        .then(dbBlogData => {
            const blogs = dbBlogData.map(blog => blog.get({ plain: true }));
            res.render('dashboard', { blogs });
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json(err);
        });
});

module.exports = router;
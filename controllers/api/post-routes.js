const router = require('express').Router();
const { Post, User, Comment} = require('../../models');
const sequelize = require('../../config/connection');
const withAuth = require('../../utils/auth');

// GET to retreive posts
router.get('/', (req, res) => {
  console.log('********************************');
  Post.findAll({
        attributes: ['id',
          'title',
          'content',
          'created_at'
        ],
        order: [['created_at', 'DESC']],
        include: [
          {
            model: User,
            attributes: ['username']
          },
          {
            model: Comment,
            attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
            include: {
              model: User,
              attributes: ['username']
            }
          }
        ]
      })
      .then(dbPostData => res.json(dbPostData.reverse()))
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  
});

// GET a single post
router.get('/:id', (req, res) => {
  Post.findOne({
    where: {
      id: req.params.id
    },
    attributes: ['id',
      'content',
      'title',
      'created_at'
    ],
    include: [
      {
        model: User,
        attributes: ['username']
      },
      {
        model: Comment,
        attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
        include: {
          model: User,
          attributes: ['username']
        }
      }
    ]
  }
      .then(dbPostData => {
        if (!dbPostData) {
          res.status(404).json({ message: 'No post found with this id' });
          return;
        }
        res.json(dbPostData);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
});
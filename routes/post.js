const express = require('express');
const { body } = require('express-validator');

const postController = require('../controllers/post-controllers');

const router = express.Router();

router.post(
  '/',
  body('title').trim().notEmpty(),
  body('img').notEmpty(),
  body('user').trim().notEmpty(),
  postController.createNewPost
);

router.patch(
  '/:postId',
  body('title').trim(),
  body('img'),
  postController.updatePost
);

router.get('/', postController.getPosts);
router.get('/:postId', postController.getPosts);
router.delete('/:postId', postController.deletePost);

module.exports = router;

const express = require('express');
const { body } = require('express-validator');
const { v4: uuidv4 } = require('uuid');

const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (request, file, callback) {
    callback(null, 'uploads/posts/')
  },
  filename: function (req, file, callback) {
    // :id
    const name = uuidv4();
    //jpeg
    const extension = file.mimetype.split('/')[1]
    const fullName = name + "." + extension;
    callback(null, fullName);
  }
})

const upload = multer({ storage: storage });

const postController = require('../controllers/post-controllers');

const router = express.Router();

router.post(
  '/',
  upload.single('img'),
  body('title').trim().notEmpty(),
  body('user').trim().notEmpty(),
  postController.createNewPost
);

router.patch(
  '/:postId',
  upload.single('img'),
  body('title').trim(),
  body('img'),
  postController.updatePost
);

router.get('/', postController.getPosts);
router.get('/:postId', postController.getPosts);
router.delete('/:postId', postController.deletePost);
router.patch('/active/:postId', postController.disablePost);

module.exports = router;

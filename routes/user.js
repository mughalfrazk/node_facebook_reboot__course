const express = require('express');
const { body } = require('express-validator');
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (request, file, callback) {
    callback(null, 'uploads/users/');
  },
  filename: function (req, file, callback) {
    // :id
    const name = req.params.id;
    //jpeg
    const extension = file.mimetype.split('/')[1];
    const fullName = name + '.' + extension;
    callback(null, fullName);
  },
});

const upload = multer({ storage: storage });

const userController = require('../controllers/user-controllers');
const { jwtDecode } = require('../middleware/jwt');

const router = express.Router();

router.post(
  '/login',
  body('email').trim().notEmpty(),
  body('password').trim().notEmpty(),
  userController.loginUser
);
router.post(
  '/register',
  body('first_name').trim().isString(),
  body('last_name').trim().isString(),
  body('email').trim().isEmail().notEmpty(),
  body('password').trim().isString().isLength({ min: 8 }).notEmpty(),
  userController.registerUser
);

router.use(jwtDecode);

router.patch(
  '/:id',
  body('first_name').trim().isString().notEmpty(),
  body('last_name').trim().isString().notEmpty(),
  userController.updateProfile
);

router.get('/', userController.getUsers);
router.get('/:id', userController.getUsers);
// /api/user/image/:id
router.patch(
  '/image/:id',
  upload.single('avatar'),
  userController.updateProfilePic
);
router.patch('/active/:userId', userController.disableUser);

// router.get('/image/:name', userController.getProfilePicture);

module.exports = router;

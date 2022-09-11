const express = require('express');
const { body } = require('express-validator');

const userController = require('../controllers/user-controllers');

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

module.exports = router;

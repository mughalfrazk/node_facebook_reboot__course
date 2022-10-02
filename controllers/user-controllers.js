const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

// This is my branch
// Just for my work

const loginUser = async (req, res) => {
  console.log('Login API called...');

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  let checkUser;
  try {
    [checkUser] = await User.find({ email });
  } catch (error) {
    return res
      .status(500)
      .json({ status: 500, message: 'Internal server error' });
  }

  if (!checkUser)
    return res
      .status(404)
      .json({ status: 404, message: 'User not found, please sign up.' });

  let checkPassword = bcrypt.compareSync(password, checkUser.password);
  if (!checkPassword)
    return res
      .status(404)
      .json({ status: 401, message: 'Invalid credentials.' });

  if (!checkUser.active)
    return res.status(400).json({
      status: 400,
      message:
        'Your account is disabled by the admin, please contact customer service.',
    });

  const token = jwt.sign(
    {
      userId: checkUser._id,
      role: checkUser.role,
      email: checkUser.email,
    },
    process.env.JWT_SECRET_KEY
  );

  res.send({
    _id: checkUser._id,
    first_name: checkUser.first_name,
    last_name: checkUser.last_name,
    email: checkUser.email,
    bio: checkUser.bio,
    username: checkUser.username,
    img: checkUser.img,
    role: checkUser.role,
    token,
  });
};

const registerUser = async (req, res) => {
  console.log('Register API called...');

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Get data from request.
  const { first_name, last_name, email, password, role } = req.body;

  // if email already exists.
  let checkEmail;
  try {
    checkEmail = await User.find({ email });
  } catch (error) {
    return res
      .status(500)
      .json({ status: 500, message: 'Internal server error' });
  }

  if (checkEmail.length)
    return res
      .status(400)
      .json({ status: 400, message: 'Email already in use.' });

  // Encrypt Password.
  let hashedPassword = bcrypt.hashSync(password, 12);

  // Create User Instance.
  const user = new User({
    first_name,
    last_name,
    email,
    password: hashedPassword,
    role: role === 'admin' ? 'admin' : 'user',
  });

  try {
    user.save();
  } catch (error) {
    return res
      .status(500)
      .json({ status: 500, message: 'Internal server error' });
  }

  const token = jwt.sign(
    {
      userId: user._id,
      role: user.role,
      email: user.email,
    },
    process.env.JWT_SECRET_KEY
  );

  res.json({
    _id: user._id,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    bio: user.bio,
    username: user.username,
    img: user.img,
    role: user.role,
    token,
  });
};

const updateProfile = async (req, res) => {
  console.log('Update user API called...');

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;
  const { first_name, last_name, bio, username, img } = req.body;

  let user;
  try {
    user = await User.findById(id);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: 'Internal server error.' });
  }

  if (!user)
    return res.status(404).json({ status: 404, message: 'User not found!' });

  user.first_name = first_name;
  user.last_name = last_name;
  user.bio = bio;
  user.username = username;
  user.img = img;

  try {
    await user.save();
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: 'Internal server error.' });
  }

  return res.status(200).json({
    status: 200,
    message: 'User Updated!',
    data: {
      _id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      bio: user.bio,
      username: user.username,
      img: user.img,
      role: user.role,
    },
  });
};

const getUsers = async (req, res) => {
  const { id } = req.params;
  const { type } = req.query;

  if (req.tokenPayload.role !== 'admin')
    return res
      .status(401)
      .send({ status: 401, message: 'User is not Authorized' });

  let users;
  try {
    if (id) {
      users = [await User.findById(id)];
    } else if (type === 'user' || type === 'admin') {
      users = await User.find({ role: type });
    } else {
      users = await User.find();
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: 'Internal server error.' });
  }

  return res.status(200).json({ status: 200, data: users });
};

const updateProfilePic = async (req, res) => {
  const id = req.params.id;

  if (req.tokenPayload.role !== 'admin' && req.params.id !== req.tokenPayload.userId)
    return res
      .status(401)
      .send({ status: 401, message: 'User is not Authorized' });

  let user;
  try {
    user = await User.findById(id);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: 'Internal server error.' });
  }

  if (!user)
    return res.status(404).json({ status: 404, message: 'User not found!' });

  user.img = '/users/' + req.file.filename;

  try {
    await user.save();
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: 'Internal server error.' });
  }

  return res.status(201).send(user);
};

const disableUser = async (req, res) => {
  const { userId } = req.params;
  const { active } = req.query;

  if (req.tokenPayload.role !== 'admin')
    return res
      .status(401)
      .send({ status: 401, message: 'User is not Authorized' });


  let updateUser;
  try {
    updateUser = await User.findById(userId);
  } catch (error) {
    return res
      .status(500)
      .json({ status: 500, message: 'Internal server error.' });
  }

  if (!updateUser)
    return res.status(404).json({ status: 404, message: 'Post not found!' });

  if (active === 'true') updateUser.active = true;
  else updateUser.active = false;

  // updatePost.active = active === 'true' ? true : false;

  try {
    await updateUser.save();
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: 'Internal server error.' });
  }

  return res
    .status(200)
    .json({ status: 200, message: 'User Updated!', data: updateUser });
};

module.exports = {
  loginUser,
  registerUser,
  updateProfile,
  getUsers,
  updateProfilePic,
  disableUser,
};

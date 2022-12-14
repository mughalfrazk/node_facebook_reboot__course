const { validationResult } = require('express-validator');
const fs = require('fs');

const Post = require('../models/post');

const createNewPost = async (req, res) => {
  console.log('Create New API called...');

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, user, description } = req.body;

  const post = new Post({
    title,
    img: '/posts/' + req.file.filename,
    user,
    description,
    date: new Date(),
  });

  try {
    await post.save();
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: 'Internal server error.' });
  }

  return res.status(201).send(post);
};

const getPosts = async (req, res) => {
  const { postId } = req.params;
  const { userId, active } = req.query;

  let posts = [];
  try {
    if (postId) {
      posts = await Post.where({ _id: postId }).populate('user');
    } else if (userId) {
      posts = await Post.where({ user: userId }).populate('user');
    } else {
      posts = await Post.where({
        active: active === 'false' ? false : true,
      }).populate('user');
    }
  } catch (error) {
    return res
      .status(500)
      .json({ status: 500, message: 'Internal server error.' });
  }

  res.status(200).json(posts);
};

const updatePost = async (req, res) => {
  console.log('Update post API called...');

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { postId } = req.params;
  const { title, description } = req.body;

  let updatePost;
  try {
    updatePost = await Post.findById(postId);
  } catch (error) {
    return res
      .status(500)
      .json({ status: 500, message: 'Internal server error.' });
  }

  if (!updatePost)
    return res.status(404).json({ status: 404, message: 'Post not found!' });

  updatePost.title = title;
  updatePost.description = description;

  if (req.file) {
    fs.unlink('./uploads' + updatePost.img, (err) => {
      console.log(err);
    });

    updatePost.img = '/posts/' + req.file.filename;
  }

  try {
    await updatePost.save();
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: 'Internal server error.' });
  }

  return res.status(200).json({ status: 200, message: 'Post Updated!' });
};

const deletePost = async (req, res) => {
  const { postId } = req.params;

  let data;
  try {
    data = await Post.deleteOne({ _id: postId });
  } catch (error) {
    return res
      .status(500)
      .json({ status: 500, message: 'Internal server error.' });
  }

  return res.status(204).json({ status: 204, message: 'Post Deleted!' });
};

const disablePost = async (req, res) => {
  const { postId } = req.params;
  const { active } = req.query;

  let updatePost;
  try {
    updatePost = await Post.findById(postId);
  } catch (error) {
    return res
      .status(500)
      .json({ status: 500, message: 'Internal server error.' });
  }

  if (!updatePost)
    return res.status(404).json({ status: 404, message: 'Post not found!' });

  if (active === 'true') updatePost.active = true;
  else updatePost.active = false;

  // updatePost.active = active === 'true' ? true : false;

  try {
    await updatePost.save();
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: 'Internal server error.' });
  }

  return res
    .status(200)
    .json({ status: 200, message: 'Post Updated!', data: updatePost });
};

module.exports = {
  createNewPost,
  getPosts,
  updatePost,
  deletePost,
  disablePost,
};

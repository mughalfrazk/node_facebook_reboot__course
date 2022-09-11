const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  username: { type: String },
  bio: { type: String },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  img: { type: String },
  role: { type: String, required: true }
})

module.exports = mongoose.model('User', userSchema)
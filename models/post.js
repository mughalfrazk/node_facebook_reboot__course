const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const postSchema = Schema({
  title: { type: String, required: true },
  description: { type: String },
  date: { type: Date, required: true },
  img: { type: String, required: true },
  active: { type: Boolean, required: true, default: true },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
})

module.exports = mongoose.model('Post', postSchema);
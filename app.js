const express = require('express');
const cors = require('cors');
const { default: mongoose } = require('mongoose');

const User = require('./models/user');
const Post = require('./models/post');

const userRoutes = require('./routes/user');
const postRoutes = require('./routes/post');

const app = express();
const port = 5000;

app.use(express.json())
app.use(cors());

app.use('/api/user', userRoutes);
app.use('/api/post', postRoutes);

app.listen(port, () => {
  console.log(`Server is listening to port ${port}`);
  
  mongoose.connect('mongodb+srv://mughalfrazk:password%40123@cluster0.ptab3pg.mongodb.net/facebook_reboot?retryWrites=true&w=majority', () => {
    console.log(`Database connected...`);
  })
})
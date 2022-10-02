const express = require('express');
const cors = require('cors');

require('dotenv').config()

const { default: mongoose } = require('mongoose');

const User = require('./models/user');
const Post = require('./models/post');

const userRoutes = require('./routes/user');
const postRoutes = require('./routes/post');
const { jwtDecode } = require('./middleware/jwt');

const app = express();
const port = 5000;

app.get("/", (req, res) => {
  return res.send("<h1>Facebook Reboot Backend</h1>")
})

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(cors());

app.use(express.static('uploads'))

app.use('/api/user', userRoutes);

app.use(jwtDecode);
app.use('/api/post', postRoutes);

app.listen(process.env.PORT || port, () => {
  console.log(`Server is listening to port ${process.env.PORT || port}`);
  
  mongoose.connect(process.env.MONGO_DB_CON_STRING, () => {
    console.log(`Database connected...`);
  })
})
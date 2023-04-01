const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./model/user');
const authRoutes = require('./route/auth.js');
const userRoutes = require('./route/user.js');
const { authenticate } = require('./route/middleware.js');

const app = express();
//setup path for '.env' file
dotenv.config();

//Mongodb Connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to database!!!!'))
  .catch(error => console.error(error));

app.use(express.json());

//User authentication routing
app.use('/users', authRoutes);
  
app.get('/users', authenticate, async (req, res) => {
    try {
      const users = await User.find();
      res.json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

//crud operation routing
app.use('/users', userRoutes);

//port
app.listen(3000, () => {
    console.log("server running on 3000 port")
})
const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const router = express.Router();

/* REGISTER */
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  const userExist = await User.findOne({ email });
  if (userExist) {
    return res.status(400).json({ message: 'User already registered. Please login.' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    name,
    email,
    password: hashedPassword
  });

  await user.save();
  res.status(201).json({ message: 'Registration successful' });
});

/* LOGIN */
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: 'User not found. Please register.' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid password' });
  }

  res.json({
    message: 'Login successful',
    user: {
      name: user.name,
      email: user.email
    }
  });
});

module.exports = router;

//this Prevents duplicate register
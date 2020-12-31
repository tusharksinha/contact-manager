const express = require('express');
const bcrypt = require('bcryptjs');
const config = require('config');
const auth = require('../middleware/auth');
const router = express.Router();
const User = require('../models/User');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

//@Route GET /api/auth
//@desc Get logged-in user
//@access Private

router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password -__v');
    res.status(200).json({ user });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: 'Oops! Something went wrong' });
  }
});

//@Route POST /api/auth
//@desc Login user
//@access Public
router.post(
  '/',
  [
    check('email', 'Please provide a valid email').isEmail(),
    check(
      'password',
      'Please provide a password with min 6 character'
    ).isLength({ min: 6 }),
  ],

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ msg: 'Invalid credentials' });
      }
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(400).json({ msg: 'Invalid credentials' });
      }

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        {
          expiresIn: 36000,
        },
        (err, token) => {
          if (err) throw err;
          res.status(201).json({ token });
        }
      );
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ msg: 'Something went wrong!' });
    }
  }
);
module.exports = router;

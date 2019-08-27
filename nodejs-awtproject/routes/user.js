const express = require('express');
const { check } = require('express-validator');

const userCtrl = require('../controllers/user');

const router = express.Router();

router.post(
  '/signup',
  check('email').isEmail(),
  check('password').isLength(10),
  userCtrl.createUser
);

router.post('/login', userCtrl.loginUser);

module.exports = router;

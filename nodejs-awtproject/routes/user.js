const express = require('express');

const userCtrl = require('../controllers/user');

const router = express.Router();

router.post('/signup', userCtrl.createUser);

router.post('/login', userCtrl.loginUser);

module.exports = router;

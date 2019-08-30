const express = require('express');
const { check } = require('express-validator');

const userCtrl = require('../controllers/user');
const checkAuth = require('../middlewares/check-auth');

const router = express.Router();

router.post(
  '/signup',
  check('email').isEmail(),
  check('password').isLength(10),
  userCtrl.createUser
);

router.post('/login', userCtrl.loginUser);

router.post('/add-to-cart', checkAuth, userCtrl.addToCart);
router.post('/remove-from-cart', checkAuth, userCtrl.removeAllFromCart);

router.get('/cart', checkAuth, userCtrl.getCart);

module.exports = router;

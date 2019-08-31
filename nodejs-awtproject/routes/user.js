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
router.post('/modify-cart', checkAuth, userCtrl.modifyCart);
router.get('/cart', checkAuth, userCtrl.getCart);

router.get('/get-user', checkAuth, userCtrl.getUserInfo);

router.put('/update', checkAuth, userCtrl.updateUserInfo);

module.exports = router;

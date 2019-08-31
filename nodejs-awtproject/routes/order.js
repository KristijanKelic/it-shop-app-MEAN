const express = require('express');

const checkAuth = require('../middlewares/check-auth');
const orderCtrl = require('../controllers/order');

const router = express.Router();

router.post('', checkAuth, orderCtrl.postCheckout);
router.get('', checkAuth, orderCtrl.getOrders);

module.exports = router;

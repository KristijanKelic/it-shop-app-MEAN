const express = require('express');

const checkAuth = require('../middlewares/check-auth');
const fileHandler = require('../middlewares/file');
const productCtrl = require('../controllers/product');

const router = express.Router();

router.get('');

router.post('', checkAuth, fileHandler, productCtrl.postProduct);

module.exports = router;

const express = require('express');

const checkAuth = require('../middlewares/check-auth');
const fileHandler = require('../middlewares/file');
const productCtrl = require('../controllers/product');

const router = express.Router();

router.get('', productCtrl.getProducts);

router.get('/:id', productCtrl.getProduct);

router.put('/:id', checkAuth, fileHandler, productCtrl.updateProduct);

router.delete('/:id', checkAuth, productCtrl.deleteProduct);

router.post('', checkAuth, fileHandler, productCtrl.postProduct);

module.exports = router;

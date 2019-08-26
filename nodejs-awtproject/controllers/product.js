const Product = require('../models/product.js');

exports.getProducts = (req, res, next) => {};

exports.postProduct = (req, res, next) => {
  const url = req.protocol + '://' + req.get('host');
  const post = new Product({
    title: req.body.title,
    content: req.body.content,
    image: url + '/images/' + req.file.filename,
    category: req.body.category,
    creator: req.userData.userId,
    price: req.body.price
  });
  post
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: 'Post added successfully',
        post: result
      });
    })
    .catch(err => {
      res.status(500).json({
        message: 'Creating a post failed!'
      });
    });
};

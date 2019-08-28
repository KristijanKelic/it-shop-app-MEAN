const Product = require('../models/product.js');

exports.getProducts = (req, res, next) => {
  const pageSize = +req.query.pageSize;
  const currentPage = +req.query.page;
  const userId = req.query.userId;

  let productQuery = Product.find().sort({ createdAt: -1 });
  if (userId) {
    productQuery = Product.find({ creator: { $ne: userId } }).sort({
      createdAt: -1
    });
  }
  let fetchedProducts;
  if (pageSize && currentPage) {
    productQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  productQuery
    .then(products => {
      fetchedProducts = products;
      if (userId) {
        return Product.countDocuments({ creator: { $ne: userId } });
      } else {
        return Product.estimatedDocumentCount();
      }
    })
    .then(count => {
      res.status(200).json({
        message: 'Products fetched successfully!',
        products: fetchedProducts,
        productCount: count
      });
    })
    .catch(err => {
      res.status(404).json({
        message: 'Fetching products failed!'
      });
    });
};

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
        message: 'Post added successfully!',
        product: result
      });
    })
    .catch(err => {
      res.status(500).json({
        message: 'Creating a post failed!'
      });
    });
};

exports.getProduct = (req, res, next) => {
  Product.findById(req.params.id)
    .then(product => {
      if (product) {
        res.status(200).json({
          message: 'Post fetched successfully!',
          product: product
        });
      } else {
        res.status(404).json({ message: 'Post not found!' });
      }
    })
    .catch(err => {
      res.status(500).json({
        message: 'Fetching post failed!'
      });
    });
};

exports.updateProduct = (req, res, next) => {
  let image = req.body.image;
  if (req.file) {
    const url = req.protocol + '://' + req.get('host');
    image = url + '/images/' + req.file.filename;
  }
  const product = new Product({
    _id: req.params.id,
    title: req.body.title,
    content: req.body.content,
    image: image,
    creator: req.userData.userId,
    category: req.body.category,
    price: req.body.price
  });
  Product.updateOne(
    { _id: req.params.id, creator: req.userData.userId },
    product
  )
    .then(result => {
      console.log(result);
      if (result.n > 0) {
        res.status(200).json({
          message: 'Updated successfully!',
          productId: req.params.id
        });
      } else {
        res.status(401).json({
          message: 'Unauthorized!'
        });
      }
    })
    .catch(err => {
      res.status(500).json({
        message: 'Updating product failed!'
      });
    });
};

exports.deleteProduct = (req, res, next) => {
  Product.deleteOne({ _id: req.params.id, creator: req.userData.userId })
    .then(result => {
      if (result.n > 0) {
        res.status(200).json({
          message: 'Deleted successfully!'
        });
      } else {
        res.status(401).json({
          message: 'Unauthorized'
        });
      }
    })
    .catch(err => {
      res.status(500).json({
        message: 'Deleting product failed!'
      });
    });
};

exports.getUserProducts = (req, res, next) => {
  Product.find({ creator: req.userData.userId })
    .then(result => {
      res.status(200).json({
        message: 'Products fetched successfully!',
        products: result
      });
    })
    .catch(err => {
      res.status(500).json({
        message: 'Fetching user products failed!'
      });
    });
};

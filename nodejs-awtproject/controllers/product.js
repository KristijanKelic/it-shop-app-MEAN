const Product = require('../models/product.js');

/* this middleware fetches all products from database */
exports.getProducts = (req, res, next) => {
  /* extracting query params to modify the query */
  const userId = req.query.userId;
  const category = req.query.category;

  let productQuery;
  /* If we have userId that means that user is logged in so we will display all products
     (because category is not specified) of other users */
  if (userId && !category) {
    productQuery = Product.find({
      creator: { $ne: userId }
    }).sort({
      createdAt: -1
    });
  } else if (!userId && category) {
    /*If user is not logged in and category is selected we display all products of matching category*/
    productQuery = Product.find({ category: category }).sort({
      createdAt: -1
    });
  } else if (userId && category) {
    /*If we have logged in user and category selected then we will display all products of that category
  that are not created by logged in user */
    productQuery = Product.find({
      creator: { $ne: userId },
      category: category
    }).sort({
      createdAt: -1
    });
  } else {
    productQuery = Product.find().sort({ createdAt: -1 });
  }
  productQuery
    .populate('creator')
    .then(products => {
      res.status(200).json({
        message: 'Products fetched successfully!',
        products: products
      });
    })
    .catch(err => {
      res.status(404).json({
        message: 'Fetching products failed!'
      });
    });
};

/* Middleware for creating product POST method */
exports.postProduct = (req, res, next) => {
  /* Extracting url to create imageUrl */
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
      res.status(201).json({
        message: 'Product created successfully!',
        product: result
      });
    })
    .catch(err => {
      res.status(500).json({
        message: 'Creating a product failed!'
      });
    });
};

/* Middleware for getting single product */
exports.getProduct = (req, res, next) => {
  Product.findById(req.params.id)
    /* populating product with creator data so we can display info about user to frontend (name, surname) */
    .populate('creator', 'name surname email')
    .then(product => {
      if (product) {
        res.status(200).json({
          message: 'Product fetched successfully!',
          product: product
        });
      } else {
        res.status(404).json({ message: 'Product not found!' });
      }
    })
    .catch(err => {
      res.status(500).json({
        message: 'Fetching product failed!'
      });
    });
};

/* Middleware for updating product */
exports.updateProduct = (req, res, next) => {
  let image = req.body.image;
  /* Checking if we have new image or user didn't change image */
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

/* Middleware for deleting product */
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

/* Middleware for getting user related products */
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

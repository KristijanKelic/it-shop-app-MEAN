const Product = require('../models/product.js');

/* this middleware fetches all products from database */
exports.getProducts = (req, res, next) => {
  /* extracting query params to modify the query */
  const pageSize = +req.query.pageSize;
  const currentPage = +req.query.page;
  const userId = req.query.userId;
  const category = req.query.category;

  let fetchedProducts;
  let productQuery = Product.find().sort({ createdAt: -1 });

  /* If we have userId that means that user is logged in so we will display all products
     (because category is not specified) of other users */
  if (userId && !category) {
    productQuery = Product.find({ creator: { $ne: userId } }).sort({
      createdAt: -1
    });
  }
  /*If user is not logged in and category is selected we display all products of matching category*/
  if (!userId && category) {
    productQuery = Product.find({ category: category }).sort({
      createdAt: -1
    });
  }
  /*If we have logged in user and category selected then we will display all products of that category
  that are not created by logged in user */
  if (userId && category) {
    productQuery = Product.find({
      creator: { $ne: userId },
      category: category
    }).sort({
      createdAt: -1
    });
  }
  /*We will always recieve pageSize and currentPage for pagination purposes to fetch products in hops
    and also this will return all products because user is not logged in and category is not specified */
  if (pageSize && currentPage) {
    productQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  productQuery
    .populate('creator')
    .then(products => {
      fetchedProducts = products;
      if (userId && category) {
        return Product.countDocuments({
          creator: { $ne: userId },
          category: category
        });
      }
      /* Counting documents so we can display max products in pagination on frontend */
      if (!userId && category) {
        return Product.countDocuments({ category: category });
      }
      if (userId && !category) {
        return Product.countDocuments({ creator: { $ne: userId } });
      }
      if (!userId && !category) {
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

/* Middleware for getting single product */
exports.getProduct = (req, res, next) => {
  Product.findById(req.params.id)
    /* populating product with creator data so we can display info about user to frontend (name, surname) */
    .populate('creator', 'name surname email')
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

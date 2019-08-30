const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { validationResult } = require('express-validator');

const User = require('../models/user');
const Product = require('../models/product');

exports.createUser = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: 'Server validation error'
    });
  }
  bcrypt
    .hash(req.body.password, 10)
    .then(hashedPW => {
      const user = new User({
        ...req.body,
        password: hashedPW
      });
      user
        .save()
        .then(result => {
          res.status(201).json({
            message: 'User created successfully',
            user: result
          });
        })
        .catch(err => {
          res.status(500).json({
            message: 'Email address is already in use'
          });
        });
    })
    .catch(err => {
      res.status(500).json({
        message: 'User creation failed!'
      });
    });
};

exports.loginUser = (req, res, next) => {
  let fetchedUser;
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(401).json({
          message: 'Invalid email address!'
        });
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {
      if (!result) {
        return res.status(401).json({
          message: 'Invalid password!'
        });
      }
      const token = jwt.sign(
        {
          email: fetchedUser.email,
          userId: fetchedUser._id
        },
        process.env.JWT_SECRET,
        {
          expiresIn: '1h'
        }
      );
      res.status(200).json({
        message: 'Logged in successfully!',
        token: token,
        expiresIn: 3600,
        userId: fetchedUser._id,
        name: fetchedUser.name
      });
    })
    .catch(err => {
      return res.status(401).json({
        message: 'Invalid authentication credentials!'
      });
    });
};

exports.addToCart = async (req, res, next) => {
  const userId = req.userData.userId;
  const productId = req.body.productId;

  const user = await User.findById(userId);
  const product = await Product.findById(productId);

  user
    .addToCart(product)
    .then(result => {
      res.status(201).json({
        message: 'Successfully added to cart!'
      });
    })
    .catch(err => {
      res.status(500).json({
        message: 'Failed to add to cart!'
      });
    });
};

exports.getCart = async (req, res, next) => {
  const userId = req.userData.userId;
  User.findById(userId)
    .populate('cart.items.productId')
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'Cart fetched successfully!',
        cart: result.cart.items
      });
    })
    .catch(err => {
      res.status(500).json({
        message: 'Failed to load the cart!'
      });
    });
};

exports.removeAllFromCart = async (req, res, next) => {
  const userId = req.userData.userId;
  const user = await User.findById(userId);

  user
    .removeAllFromCart(req.body.productId)
    .then(result => {
      res.status(200).json({
        message: 'Deleted successfully!'
      });
    })
    .catch(err => {
      res.status(500).json({
        message: 'Something went wrong!'
      });
    });
};

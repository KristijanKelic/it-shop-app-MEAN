const Order = require('../models/order');
const User = require('../models/user');

const stripe = require('stripe')(process.env.STRIPE_SK);

exports.postCheckout = async (req, res, next) => {
  const token = req.body.token;

  const user = await User.findById(req.userData.userId).populate(
    'cart.items.productId'
  );

  if (user) {
    const products = user.cart.items.map(i => {
      return { quantity: i.quantity, product: { ...i.productId._doc } };
    });
    const order = new Order({
      user: {
        email: user.email,
        userId: user._id
      },
      products: products
    });
    order
      .save()
      .then(result => {
        let amount = 0;
        user.cart.items.forEach(el => {
          amount += el.productId.price * el.quantity;
        });
        amount *= 100;
        const charge = stripe.charges.create({
          amount,
          currency: 'eur',
          description: user.name + ' ' + user.surname + ' orders',
          source: token.id
        });
        return user.clearCart();
      })
      .then(result => {
        res.status(200).json({
          message: 'You order is created!'
        });
      })
      .catch(err => {
        res.status(500).json({
          message: 'Something went wrong!'
        });
      });
  }
};

exports.getOrders = (req, res, next) => {
  Order.find({ 'user.userId': req.userData.userId })
    .then(orders => {
      res.status(200).json({
        orders: orders
      })
    })
    .catch(err => {
      res.status(500).json({
        message: 'Something went frong!'
      })
    });
};

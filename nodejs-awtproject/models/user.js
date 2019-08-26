const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  surname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  cart: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId },
      quantity: { type: Number, required: true }
    }
  ]
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);

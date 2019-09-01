const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

const User = require('../models/user');

exports.requestPasswordReset = (req, res, next) => {
  const token = crypto.randomBytes(20).toString('hex');
  let fetchedUser;
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        res.status(404).json({
          message: 'There is no user with that email. Do you want to sign up?'
        });
      } else {
        fetchedUser = user;
        user.resetPasswordToken = token;
        user.resetPasswordTokenExpires = Date.now() + 600000;
        return user.save();
      }
    })
    .then(result => {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: `${process.env.EMAIL_ADDRESS}`,
          pass: `${process.env.EMAIL_PASSWORD}`
        }
      });

      const mailOptions = {
        from: 'ITShop@gmail.com',
        to: `${fetchedUser.email}`,
        subject: 'Link to reset password',
        text: `
            You are receiving this because you (or someone else) have requested the reset of passwrod for this account\n
            Please click on the following link to complete the process within 10 minutes of receiving it (before token expires)\n
            -> http://localhost:4200/reset-password/${token} <-\n\n
            If this wasn't you, please ignore this email and your password will remain unchanged
        `
      };

      transporter.sendMail(mailOptions, function(err, response) {
        if (err) {
          console.log(err);
          res.json({
            message: 'There was an error with sending email!'
          });
        } else {
          res.status(200).json({
            message: 'Please check your email and follow the link you recieved'
          });
        }
      });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: 'Something went wrong!'
      });
    });
};

exports.checkResetToken = (req, res, next) => {
  User.findOne({
    resetPasswordToken: req.query.token,
    resetPasswordTokenExpires: {
      $gt: Date.now()
    }
  })
    .then(user => {
      if (user) {
        res.status(200).json({
          valid: true,
          email: user.email
        });
      } else {
        res.json({
          valid: false,
          email: null
        });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: 'Something went wrong!'
      });
    });
};

exports.resetPassword = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then(user => {
      if (user) {
        bcrypt.hash(req.body.newPassword, 10).then(hashedPw => {
          user.password = hashedPw;
          user.resetPasswordToken = null;
          user.resetPasswordTokenExpires = null;
          return user.save();
        });
      }
    })
    .then(result => {
      res.status(200).json({
        message: 'Password is changed sucessfully!'
      });
    })
    .catch(err => {
      res.status(500).json({
        message: 'Something went wrong!'
      });
    });
};

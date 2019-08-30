const jwt = require('jsonwebtoken');

/* Middleware for checking if user is authenticated */
module.exports = (req, res, next) => {
  try {
    /* If user is authenticated we will have token stored in every request header */
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.userData = {
      email: decodedToken.email,
      userId: decodedToken.userId
    };
    next();
  } catch (error) {
    res.status(401).json({
      message: 'You are not authenticated!'
    });
  }
};

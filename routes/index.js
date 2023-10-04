const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

// Welcome Page
router.get('/',  (req, res) => res.render('welcome'));

// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) => {
  const userImage = req.user ? req.user.user_image : 'Boss';
  res.render('dashboard', {
    user: req.user ? req.user.user_name : '',
    userImage: userImage,
    userEmail : req.user.user_email,
    totalOrders : req.user.total_orders,
    id : req.user.user_id
  });
});

module.exports = router;

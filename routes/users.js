const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// Load User model
const User = require('../models/User');
const { forwardAuthenticated } = require('../config/auth');

const upload = require('../config/multerConfig');

// Login Page
router.get('/login',  (req, res) => res.render('login'));

 // Register Page
router.get('/register',  (req, res) => res.render('register'));


// Registration route
router.post('/register', upload.single('user_image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }
  const { name, email, password, password2, order } = req.body;
  let errors = [];

  // Validation checks
  if (!name || !email || !password || !password2) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password !== password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password && password.length < 4) {
    errors.push({ msg: 'Password must be at least 4 characters' });
  }

  try {
    // Check if email is already registered
    const existingUser = await User.findOne({ where: { user_email: email } });
    if (existingUser) {
      errors.push({ msg: 'Email already exists' });
    }

    if (errors.length > 0) {
      // Handle errors by rendering a registration form with error messages
      res.render('register', { errors, name, email, password, password2, order });
    } else {


      let imagePath = '';
      if (req.file) {
        console.log('Uploaded file:', req.file);
        console.log('Image path:', imagePath);

        var imgsrc = 'http://127.0.0.1:3000/' + req.file.filename
        imagePath = imgsrc;
        
      }

      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create a new user with the hashed password
      const newUser = await User.create({
        user_name: name,
        user_email: email,
        user_password: hashedPassword,
        total_orders: order,
        user_image: imagePath,
      });

      // Redirect to the login page upon successful registration
      req.flash('success_msg', 'You are now registered and can log in');
      res.redirect('/users/login');
    }
  } catch (error) {
    console.error(error);
    // Handle database or other errors by rendering an error page or sending an error response
    res.status(500).send('Internal Server Error');
  }
});

router.get('/delete/:id',async(req, res) => {
  try {
    await User.destroy({
      where: { user_id: req.params.id },
    });

    req.flash('success_msg', 'User deleted successfully');
    res.redirect('/users/login'); // Redirect to a login page or any other page
  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'Failed to delete user');
    res.redirect('/users/register'); // Redirect to the user's profile page or an error page
  }
});


router.get('/edit/:id',   async (req, res) => {
      const id = req.params.id;
  // Fetch the book data based on the provided ID
      const user = await User.findByPk(id);
      if (!user) {
        // Handle the case where the user with the given ID is not found
        return res.status(404).render('error', { message: 'User not found' });
      }
      console.log(user.user_name)
      
      res.render('editUser',{ name : user.user_name,
        email : user.user_email,
        order : user.total_orders,
        image: user.user_image,
        user_id : id},
        );
});

router.post('/update/:id',upload.single('user_image'), async (req, res) => {
  try {
      const id = req.params.id;
      const { name, email, password, order } = req.body;

      var imgsrc = 'http://127.0.0.1:3000/' + req.file.filename
      let imagePath = imgsrc;

      // Fetch the user based on the provided ID
      const user = await User.findByPk(id);
      

      if (!user) {
          // Handle the case where the user with the given ID is not found
          return res.status(404).render('error', { message: 'User not found' });
      }


      if (req.file) {
        console.log('Uploaded file:', req.file);
        console.log('Image path:', imagePath);
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Update user information
      user.user_name = name;
      user.user_email = email;
      user.user_password = hashedPassword;
      user.total_orders = order;
      user.user_image = imagePath; // Update image path if needed

      // Save the updated user data to the database
      await user.save();

      // Redirect to the user's profile or another appropriate page
      res.redirect('/users/login');
  } catch (error) {
      console.error(error);
      // Handle errors by rendering an error page or sending an error response
      res.status(500).render('error', { message: 'Internal Server Error' });
  }
});



// Login
router.post('/login', (req, res, next) => {
  
  passport.authenticate('local', {
    
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});

module.exports = router;

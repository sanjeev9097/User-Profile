const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
// Create a Sequelize instance

// Check the database connection


// User Models;
const User = sequelize.define('User', {
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  user_email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  user_password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  user_image: {
    type: DataTypes.STRING,
  },
  total_orders: {
    type: DataTypes.INTEGER,
    defaultValue: 0, // Default value for total_orders
  },
  last_logged_in: {
    type: DataTypes.DATE, // Store timestamps
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: sequelize.literal('CURRENT_TIMESTAMP'), // Default to the current timestamp
  },
  
});


User.sync().then(() => {
  console.log('User table created');
});

// Export the User model
module.exports = User;




// const mongoose = require('mongoose');

// const UserSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true
//   },
//   email: {
//     type: String,
//     required: true
//   },
//   password: {
//     type: String,
//     required: true
//   },
//   date: {
//     type: Date,
//     default: Date.now
//   }
// });

// const User = mongoose.model('User', UserSchema);

// module.exports = User;

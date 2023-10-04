const { Sequelize } = require('sequelize');



const sequelize = new Sequelize({
  database: 'quadb',
  username: 'root',
  password: '123456789',
  host: 'localhost', // Database host
  dialect: 'mysql',  // Database dialect, e.g., 'mysql', 'postgres', 'sqlite', 'mssql', etc.
  port: 3306,
  logging: false,        // Database port (if applicable)
  // Other options as needed...
});

module.exports = sequelize;


// module.exports = {
//     development: {
//       username: 'root',
//       password: '123456789',
//       database: 'quadb',
//       host: 'localhost',
//       dialect: 'mysql', // This should match your database type
//     },
    
//   };




// dbPassword =  'mongodb+srv://newcoder:Sanjeev9097@cluster0.t62vdxe.mongodb.net/node1?retryWrites=true&w=majority';

// module.exports = {
//     mongoURI: dbPassword
// };

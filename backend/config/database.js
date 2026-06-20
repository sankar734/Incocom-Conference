// const { Sequelize } = require('sequelize');

// const sequelize = new Sequelize(
//   process.env.MYSQL_DATABASE || 'incocom2k26',
//   process.env.MYSQL_USER     || 'root',
//   process.env.MYSQL_PASSWORD || '',
//   {
//     host:    process.env.MYSQL_HOST || 'localhost',
//     port:    parseInt(process.env.MYSQL_PORT || '3306'),
//     dialect: 'mysql',
//     logging: false,
//     pool: { max: 5, min: 0, acquire: 30000, idle: 10000 },
//   }
// );

// async function connectDB() {
//   await sequelize.authenticate();
//   console.log('✅  MySQL connected');
//   await sequelize.sync({ alter: true });
//   console.log('✅  Tables synced');
// }

// module.exports = { sequelize, connectDB };


const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.MYSQL_DATABASE || 'incocom2k26',
  process.env.MYSQL_USER     || 'root',
  process.env.MYSQL_PASSWORD || '',
  {
    host: process.env.MYSQL_HOST || 'localhost',
    port: parseInt(process.env.MYSQL_PORT || '3306'),
    dialect: 'mysql',
    logging: false,

    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

async function connectDB() {
  try {
    await sequelize.authenticate();
    console.log('✅ MySQL connected');

    // ✅ FIX: DO NOT use alter:true
    await sequelize.sync(); 
    console.log('✅ Tables synced (safe mode)');

  } catch (error) {
    console.error('❌ DB Error:', error.message);
    process.exit(1);
  }
}

module.exports = { sequelize, connectDB };
const { Sequelize } = require('sequelize');
require('dotenv').config();

let sequelize;

const dbUrl = process.env.DATABASE_URL || process.env.MYSQL_URL || process.env.CLEARDB_DATABASE_URL || process.env.JAWSDB_URL;
const isSSL = process.env.MYSQL_SSL === 'true' || (dbUrl && dbUrl.includes('ssl='));

if (dbUrl) {
  sequelize = new Sequelize(dbUrl, {
    dialect: 'mysql',
    logging: false,
    dialectOptions: isSSL ? {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    } : {},
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  });
} else {
  sequelize = new Sequelize(
    process.env.MYSQL_DATABASE || 'incocom2k26',
    process.env.MYSQL_USER     || 'root',
    process.env.MYSQL_PASSWORD !== undefined ? process.env.MYSQL_PASSWORD : 'root',
    {
      host: process.env.MYSQL_HOST || 'localhost',
      port: parseInt(process.env.MYSQL_PORT || '3306'),
      dialect: 'mysql',
      logging: false,
      dialectOptions: isSSL ? {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      } : {},
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
    }
  );
}

async function connectDB() {
  try {
    await sequelize.authenticate();
    console.log('✅  MySQL connected successfully');
    await sequelize.sync();
    console.log('✅  Database tables synchronized');
    return true;
  } catch (error) {
    const errorDetails = error.original?.message || error.parent?.message || error.message || error.name || 'Unknown database connection error';
    const errorCode = error.original?.code || error.parent?.code || error.code || '';
    
    console.error('❌  MySQL DB Connection Error:', errorDetails, errorCode ? `[${errorCode}]` : '');
    
    if (errorCode === 'ECONNREFUSED' || errorDetails.includes('ECONNREFUSED')) {
      console.warn('⚠️   Hint: Local MySQL server is not running on port 3306. If using XAMPP/WAMP, make sure MySQL is started.');
    } else if (errorCode === 'ER_ACCESS_DENIED_ERROR' || errorDetails.includes('Access denied')) {
      console.warn('⚠️   Hint: MySQL username or password in .env is incorrect.');
    } else if (errorCode === 'ER_BAD_DB_ERROR' || errorDetails.includes('Unknown database')) {
      console.warn(`⚠️   Hint: Database "${process.env.MYSQL_DATABASE || 'incocom2k26'}" does not exist. Please create it in MySQL.`);
    }
    
    throw error;
  }
}

module.exports = { sequelize, connectDB };
const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/database');

const Admin = sequelize.define('Admin', {
  id:       { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email:    { type: DataTypes.STRING(200), unique: true, allowNull: false },
  password: { type: DataTypes.STRING(255), allowNull: false },
  name:     { type: DataTypes.STRING(200), defaultValue: 'Admin' },
  role:     { type: DataTypes.STRING(50),  defaultValue: 'admin' },
}, { tableName: 'admins', timestamps: true });

Admin.prototype.comparePassword = async function(pw) {
  return bcrypt.compare(pw, this.password);
};

Admin.beforeCreate(async (admin) => {
  if (admin.password) admin.password = await bcrypt.hash(admin.password, 12);
});

module.exports = Admin;

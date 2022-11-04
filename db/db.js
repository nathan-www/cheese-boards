const Sequelize = require('sequelize')

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: __dirname + '/db.sqlite'
  });

module.exports = sequelize

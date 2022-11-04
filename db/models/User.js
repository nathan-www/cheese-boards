const { Sequelize, DataTypes } = require('sequelize');
const db = require('../db')

const User = db.define('User', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            is: /^[A-z -]+$/, // Allow A-z and '-' and ' '
            notNull: true
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true,
            notNull: true
        }
    }
})

module.exports = User

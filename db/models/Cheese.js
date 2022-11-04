const { Sequelize, DataTypes } = require('sequelize');
const db = require('../db')

const Cheese = db.define('Cheese', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            is: /^[A-z -]+$/,
            notNull: true
        }
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: true
        }
    }
})

module.exports = Cheese

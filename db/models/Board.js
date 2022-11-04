const { Sequelize, DataTypes } = require('sequelize');
const db = require('../db')

const Board = db.define('Board', {
    type: {
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
    },
    rating: {
        type: DataTypes.NUMBER,
        allowNull: false,
        validate: {
            is: /^[0-9]+$/, // Allow digits 0-9
            notNull: true
        }
    }
})

module.exports = Board

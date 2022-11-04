const Board = require('./board')
const Cheese = require('./cheese')
const User = require('./user')

User.hasMany(Board)
Board.belongsTo(User)

Cheese.belongsToMany(Board, { through: 'CheesesOnBoard' })
Board.belongsToMany(Cheese, { through: 'CheesesOnBoard' })

module.exports = { Board, Cheese, User }

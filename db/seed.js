const db = require('./db')
const { Board, Cheese, User } = require('./models')

let seed = async () => {
    await db.sync({ force: true });
}

module.exports = seed

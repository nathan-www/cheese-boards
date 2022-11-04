const { Sequelize, DataTypes } = require('sequelize')
const { describe, expect, test } = require('@jest/globals');
const db = require('../db/db')
const seed = require('../db/seed')
const { Board, Cheese, User } = require('../db/models')

beforeAll( async () => {
    await seed()
})

test('Sequelize connects to the database', () => {
    expect(db).toBeInstanceOf(Sequelize)
})

test('Database has model User', () => {
    expect(db.isDefined('User')).toBeTruthy()
})

test('User model has name as a string', () => {
    expect(User.tableAttributes.hasOwnProperty('name')).toBeTruthy()
    expect(User.tableAttributes.name.type).toBeInstanceOf(DataTypes.STRING)
})

test('User model has email as a string', () => {
    expect(User.tableAttributes.hasOwnProperty('email')).toBeTruthy()
    expect(User.tableAttributes.email.type).toBeInstanceOf(DataTypes.STRING)
})

test('User model accepts valid inputs', async () => {
    let user = await User.create({
        name: 'Jeff',
        email: 'jeff@jeff.com'
    })

    expect((await User.findAndCountAll({ where: { name: "Jeff" }})).count).toBeGreaterThanOrEqual(1)
})

test('User model does not accept null values', async () => {
    expect.assertions(1);
    try{
        await User.create({
            name: null,
            email: null
        })
    } catch (e) {
        expect(e).toBeInstanceOf(Sequelize.ValidationError)
    }
})

test('User model does not accept invalid email', async () => {
    expect.assertions(1);
    try{
        await User.create({
            name: "Jeff",
            email: "blablabla"
        })
    } catch (e) {
        expect(e).toBeInstanceOf(Sequelize.ValidationError)
    }
})



test('Database has model Board', () => {
    expect(db.isDefined('Board')).toBeTruthy()
})

test('Board model has type as a string', () => {
    expect(Board.tableAttributes.hasOwnProperty('type')).toBeTruthy()
    expect(Board.tableAttributes.type.type).toBeInstanceOf(DataTypes.STRING)
})

test('Board model has description as a string', () => {
    expect(Board.tableAttributes.hasOwnProperty('description')).toBeTruthy()
    expect(Board.tableAttributes.description.type).toBeInstanceOf(DataTypes.STRING)
})

test('Board model has rating as a number', () => {
    expect(Board.tableAttributes.hasOwnProperty('rating')).toBeTruthy()
    expect(Board.tableAttributes.rating.type).toBeInstanceOf(DataTypes.NUMBER)
})

test('Board model accepts valid inputs', async () => {
    let board = await Board.create({
        type: 'Soft cheese',
        description: 'A cheese board',
        rating: 7
    })

    expect((await Board.findAndCountAll({ where: { type: "Soft cheese" }})).count).toBeGreaterThanOrEqual(1)
})

test('Board model does not accept null values', async () => {
    expect.assertions(1);
    try{
        await Board.create({
            type: null,
            description: null,
            rating: null
        })
    } catch (e) {
        expect(e).toBeInstanceOf(Sequelize.ValidationError)
    }
})

test('Board model does not string as number for rating', async () => {
    expect.assertions(1);
    try{
        await Board.create({
            type: 'Soft cheese',
            description: 'A cheese board',
            rating: 'bad'
        })
    } catch (e) {
        expect(e).toBeInstanceOf(Sequelize.ValidationError)
    }
})



test('Database has model Cheese', () => {
    expect(db.isDefined('Cheese')).toBeTruthy()
})

test('Cheese model has title as a string', () => {
    expect(Cheese.tableAttributes.hasOwnProperty('title')).toBeTruthy()
    expect(Cheese.tableAttributes.title.type).toBeInstanceOf(DataTypes.STRING)
})

test('Cheese model has description as a string', () => {
    expect(Cheese.tableAttributes.hasOwnProperty('description')).toBeTruthy()
    expect(Cheese.tableAttributes.description.type).toBeInstanceOf(DataTypes.STRING)
})

test('Cheese model accepts valid inputs', async () => {
    let cheese = await Cheese.create({
        title: 'Camembert',
        description: 'nice'
    })

    expect((await Cheese.findAndCountAll({ where: { title: "Camembert" }})).count).toBeGreaterThanOrEqual(1)
})

test('Cheese model does not accept null values', async () => {
    expect.assertions(1);
    try{
        await Cheese.create({
            title: null,
            description: null
        })
    } catch (e) {
        expect(e).toBeInstanceOf(Sequelize.ValidationError)
    }
})


test('Multiple boards can be added to a User', async () => {

    let user = await User.create({
        name: 'Jeff',
        email: 'jeff@jeff.com'
    })

    let board1 = await Board.create({
        type: 'Soft cheese',
        description: 'A cheese board',
        rating: 7
    })

    let board2 = await Board.create({
        type: 'Hard cheese',
        description: 'A cheese board',
        rating: 10
    })

    board1.setUser(user)
    board2.setUser(user)

    let userBoards = await user.getBoards()

    expect(userBoards.length).toBe(2)
    expect(JSON.stringify(userBoards.map((i) => i.id)) == JSON.stringify([board1.id,board2.id])).toBeTruthy()

})


test('A Board can have many Cheeses, and a Cheese can be on many Boards', async () => {

    let board1 = await Board.create({
        type: 'Soft cheese',
        description: 'A cheese board',
        rating: 7
    })

    let board2 = await Board.create({
        type: 'Hard cheese',
        description: 'A cheese board',
        rating: 10
    })

    let cheese1 = await Cheese.create({
        title: "Brie",
        description: "A cheese"
    })

    let cheese2 = await Cheese.create({
        title: "Camembert",
        description: "A cheese"
    })

    await board1.addCheese(cheese1)
    await board1.addCheese(cheese2)

    await board2.addCheese(cheese1)
    await board2.addCheese(cheese2)

    //Can get cheeses for board
    let board1Cheeses = await board1.getCheeses()
    let board2Cheeses = await board2.getCheeses()

    expect(board1Cheeses.length).toBe(2)
    expect(board2Cheeses.length).toBe(2)

    expect(JSON.stringify(board1Cheeses.map((i) => i.id)) == JSON.stringify([cheese1.id,cheese2.id])).toBeTruthy()
    expect(JSON.stringify(board2Cheeses.map((i) => i.id)) == JSON.stringify([cheese1.id,cheese2.id])).toBeTruthy()

    //Can get boards for cheese
    let cheese1Boards = await cheese1.getBoards()
    let cheese2Boards = await cheese2.getBoards()

    expect(cheese1Boards.length).toBe(2)
    expect(cheese2Boards.length).toBe(2)

    expect(JSON.stringify(cheese1Boards.map((i) => i.id)) == JSON.stringify([board1.id,board2.id])).toBeTruthy()
    expect(JSON.stringify(cheese2Boards.map((i) => i.id)) == JSON.stringify([board1.id,board2.id])).toBeTruthy()

})


test('Eager Loading tests: A board can be loaded with its cheeses' , async () => {

    let board = await Board.create({
        type: 'Soft cheese',
        description: 'A cheese board',
        rating: 7
    })

    let cheese1 = await Cheese.create({
        title: "Brie",
        description: "A cheese"
    })

    let cheese2 = await Cheese.create({
        title: "Camembert",
        description: "A cheese"
    })

    await board.addCheese(cheese1)
    await board.addCheese(cheese2)

    let boardWithCheeses = await Board.findOne({ where: { id: board.id }, include: Cheese })

    expect(boardWithCheeses.Cheeses.length).toBe(2)
    expect(JSON.stringify(boardWithCheeses.Cheeses.map((i) => i.id)) == JSON.stringify([cheese1.id,cheese2.id])).toBeTruthy()

})

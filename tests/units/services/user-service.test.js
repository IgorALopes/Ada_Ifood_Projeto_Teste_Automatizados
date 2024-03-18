const { faker } = require('@faker-js/faker')
const UserService = require('../../../src/services/user-service')
const User = require('../../../src/schemas/User')

const UserMock = {
    findOne: async () => null, // A função do Mongoose, "findOne", retorna null quando não encontra o que foi pesquisado.
    create: async () => ({ id: faker.database.mongodbObjectId()}),
    userCredentials: async () => ({
        name: faker.person.fullName(),
        email: faker.internet.email(),
    })
}

const user = {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password()
}


describe('User service test', () => {
    test('Shoud return an ID when a new user is created', async () => {
        jest.spyOn(User, 'create').mockImplementationOnce(UserMock.create)
        
        console.log(user)

        const userCreated = await UserService.createUser(user)

        expect(userCreated).toHaveProperty('id')
    })

    test('Shoud return true if user exists and the passwords match.', async () => {
        jest.spyOn(User, 'findOne').mockImplementationOnce(UserMock.userCredentials)

        const userExist = await UserService.userExistsAndCheckPassword(UserMock.userCredentials)

        expect(userExist).toBe(true)

    })

    test('Should return false if an user do not exist.', async () => {
        jest.spyOn(User, 'findOne').mockImplementationOnce(UserMock.findOne)
    
        const userAbsent = await UserService.userExistsAndCheckPassword(UserMock.userCredentials)

        expect(userAbsent).toBe(false)
    })  

    test('Should throws if password do not match', async () => {
        jest.spyOn(User, 'findOne').mockImplementationOnce(UserMock.userCredentials)

        try {
            await UserService.userExistsAndCheckPassword(UserMock.userCredentials)
        } catch (error) {
            expect(error).toHaveProperty('status', 400)
            expect(error).toHaveProperty('message', 'As senhas não batem')
        }
    })

})
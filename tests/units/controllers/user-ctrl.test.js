const UserController = require('../../../src/controllers/user-ctrl')
const UserService = require('../../../src/services/user-service')
const EmailValidator = require('../../../src/utils/email-validator')
const { faker } = require('@faker-js/faker')

const reqMock = {
    body: {
        name: "Igor Lopes",
        email: "igor@email.com",
        password: "SenhaSegura123"
    }
}

const reqMockNoPassword = {
    body: {
        name: "Igor Lopes",
        email: "igor@email.com",
        password: null
    }
}

const resMock = {
    status: (status) => {
        console.log('STATUS:', status)
        return {
            json: (data) => {
                console.log('DATA:', data)
            }
        }
    }
}

const UserServiceMock = {
    create: () => ({ 
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password() 
    })
}

describe('Client controller tests', () => {
    test('Should return status 200 a new user is created.', async () => {
        jest.spyOn(EmailValidator, 'isValid').mockImplementationOnce(() => true)
        jest.spyOn(UserService, 'createUser').mockImplementationOnce(UserServiceMock.create)

        const resStatusSpy = jest.spyOn(resMock, 'status')

        await UserController.create(reqMock, resMock)

        expect(resStatusSpy).toHaveBeenCalledWith(200)
    })

    test('Should throws if email is invalid.', async () => {
        jest.spyOn(EmailValidator, 'isValid').mockImplementationOnce(() => false)
        jest.spyOn(UserService, 'createUser').mockImplementationOnce(UserServiceMock.create)

        try {
            await UserController.create(reqMock, resMock)
        } catch (error) {
            expect(error).toHaveProperty('status', 400)
            expect(error).toHaveProperty('message', 'Email inválido')
        }
    })

    test('Should throws if password is invalid.', async () => {
        try {
            await UserController.create(reqMockNoPassword, resMock)
        } catch (error) {
            expect(error).toHaveProperty('status', 400)
            expect(error).toHaveProperty('message', 'Senha inválida')
        }
    })

    test('Should return status 500 if server error.', async () => {
        //jest.spyOn(EmailValidator, 'isValid').mockImplementationOnce(() => true)
        // jest.spyOn(UserService, 'createUser').mockImplementationOnce(() => {
        //     throw new Error()
        // })

        try {
            await UserController.create(reqMock, resMock)
        } catch (error) {
            expect(error).toHaveProperty('status', 500)
            expect(error).toHaveProperty('message', 'Server Error')
        }
    })
})
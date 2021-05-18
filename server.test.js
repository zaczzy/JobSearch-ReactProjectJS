let assert = require('chai').assert;
let request = require('supertest-as-promised');

let app = require('../../app');
let _user = 'integration_test_' + Math.floor(Date.now() / 1000) + '@alttab.co';

describe('Authentication Controller', () => {

  it('should register a new user and return token', () => {
    let _token = null;

    return request(app)
      .post('/api/register')
      .send({
        email: _user,
        password: 'integration',
        name: 'Integration Test'
      })
      .expect(201)
      .then((data) => {
        _token = data.body.token;
        assert.ok(_token);
      });
  });

  it('should login existing User', () => {
    let _token = null;
    return request(app)
      .post('/api/login')
      .send({
        email: _user,
        password: 'integration'
      })
      .expect(200)
      .then((data) => {
        _token = data.body.token;
        assert.ok(_token);
      });
  });
});

const request = require('supertest');
const mongoose = require('mongoose');
const sha256 = require('sha256');

const app = require('../index.js');
const User = require('./models/user_model.js');
const Conversation = require('../models/conversation.js');
const Message = require('../models/message.js');
const Image = require('../models/image.js');
const user_routes = require('../routes/user_routes.js');
const conversation_routes = require('../routes/conversation_routes.js');
const imageRoutes = require('../routes/image_routes.js');
const DbCommon = require('../routes/db_common.js');

jest.setTimeout(30000);
jest.disableAutomock();

const delay = (ms) => new Promise((res) => setTimeout(res, ms));
const beforeAllDelay = async () => delay(5000);

beforeAll(async () => {
    await mongoose.connect('mongodb+srv://Admin:RulesOfCivility557@gab-cluster.wldoi.mongodb.net/jest_env', { useNewUrlParser: true });
    const db = mongoose.connection;
    db.once('open', (_) => console.log('CONNECTED TO JEST DB'));
    await beforeAllDelay();
});

const testUserOne = {
    handle: 'test_user_one',
    displayName: 'TestUser1',
    password: 'test1',
    email: 'test1@gmail.com',
};

const testUserTwo = {
    handle: 'test_user_two',
    displayName: 'TestUser2',
    password: 'test2',
    email: 'test2@gmail.com',
};

/*
* /CREATE_USER
*/
describe('Test /register', () => {
    const validNewUser = {
        handle: 'test_user',
        email: 'test@gmail.com',
        password: 'test',
        displayName: 'test',
    };

    test('create user successfully', async () => {
        expectedResponse = {
            user: {
                handle: 'test_user',
                email: 'test@gmail.com',
                displayName: 'test',
            },
            message: 'User Created',
        };
        // await delay(5000); // let db load
        const resp = await request(app).post('/register').send(validNewUser).expect(200);
        await delay(3000);
        await expect(JSON.parse(resp.text)).toEqual(expectedResponse);
        await User.deleteOne({ email: validNewUser.email });
    });

    test('cannot create duplicate user', async () => {
        await request(app).post('/register').send(validNewUser);
        await request(app).post('/register').send(validNewUser).expect(400)
            .then((response) => {
                expect(JSON.stringify(response.text)).toMatch(/User Already Exists/);
            });
        await User.deleteOne({ email: validNewUser.email });
    });
});

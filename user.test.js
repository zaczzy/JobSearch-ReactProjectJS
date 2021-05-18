const request = require('supertest');
const mongoose = require('mongoose');
const app = require('./server');
const User = require('./models/user_model');
const Follow = require('./models/follow_model');

const appPort = 5003;
const ObjectId = mongoose.Types.ObjectId;

// Global IDs for testing
let uid;

// connect to db
const uri = "mongodb+srv://admin:mongoose@cluster0.yvohi.mongodb.net/agileman?retryWrites=true&w=majority";
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => app.listen(appPort))
  .catch((err) => console.log(err));


const clearDatabase = async () => {
  try {
    // delete chat
    const result = await User.deleteOne({ _id: uid });
    const { deletedCount } = result;
    if (deletedCount === 1) {
      console.log('info', 'Successfully deleted user');
    } else {
      console.log('warning', 'user was not deleted');
    }
  } catch (err) {
      console.log('error', err.message);
  }
};

afterAll(async () => {
  await clearDatabase();
  // DISCONNECT FROM DB
  mongoose.disconnect();
});

beforeAll(async () => {
    // make test user
    const testUser = {
        email: 'test@test.com',
        password: 'password',
        handle: 'test',
        displayName: 'Test User'
    }
    // create dummy User
    const result = await User.create(testUser);
    uid = result._id;
})

// -------------- TEST CASES HERE -------------------------------
describe('Get user profile unit test', () => {
  test('Endpoint status code and response', () => request(app).get(`/user/${uid.toString()}`)
  .set('Cookie', [`currId=${uid}`])
    .expect(200)
    .then((response) => {
      const testUser = {
          email: 'test@test.com',
          password: 'password',
          handle: 'test',
          displayName: 'Test User'
      }
      // toMatchObject check that a JavaScript object matches
      // a subset of the properties of an object
      const { profile } = JSON.parse(response.text);
      expect(profile).toMatchObject(testUser);
  }));
});

const myUid = ObjectId();
const hisUid = ObjectId();

describe('Test follow', ()=>{
  test('Check if follows in DB', (done)=>{
    request(app).post(`/user/follow/${hisUid}`)
    .set('Cookie', [`currId=${myUid}`])
    .send('')
    .expect(200)
    .then(res=>{
      const relId = ObjectId(JSON.parse(res.text));
      Follow.findOne({user: myUid}).then(rel=>{
        expect(JSON.stringify(rel.follows)).toBe(JSON.stringify(hisUid));
        done();
      })
    });
  })
})

describe('Test unfollow', ()=>{
  test('Response', (done)=>{
    request(app).post(`/user/unfollow/${hisUid}`)
    .set('Cookie', [`currId=${myUid}`])
    .send('')
    .expect(200)
    .then(res=>{
      expect(res.text).toBe('success');
      done();
    });
  })
})
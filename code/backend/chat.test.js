const request = require('supertest');
const mongoose = require('mongoose');
const app = require('./server');
const Chat = require('./models/chat_model');
const Message = require('./models/message_model');

const appPort = 5000;
const ObjectId = mongoose.Types.ObjectId;

// IDs for testing
let cid;
let uid1;
let uid2;
let mid;

// connect to db
const uri = "mongodb+srv://admin:mongoose@cluster0.yvohi.mongodb.net/agileman?retryWrites=true&w=majority";
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => app.listen(appPort))
  .catch((err) => console.log(err));

const clearDatabase = async () => {
  try {
    // delete chat
    const result = await Chat.deleteOne({ _id: cid });
    let { deletedCount } = result;
    if (deletedCount === 1) {
      console.log('info', 'Successfully deleted chat');
    } else {
      console.log('warning', 'chat was not deleted');
    }
    // delete message
    const mRes = await Message.deleteOne({ _id: mid });
    deletedCount = mRes.deletedCount;
    if (deletedCount === 1) {
      console.log('info', 'Successfully deleted message');
    } else {
      console.log('warning', 'message was not deleted');
    }
  } catch (err) {
    console.log('error', err.message);
  }
};

afterAll(async () => {
  await clearDatabase();
  mongoose.disconnect();
});

beforeAll(async () => {
    uid1 = ObjectId();
    uid2 = ObjectId();
    // create dummy chat
    const result = await Chat.create({ users: [uid1, uid2], messages: [] })
    cid = result._id;
})

describe('Get users chats unit test', () => {
  test('Endpoint status code and response', () => request(app).get('/chat/')
  .set('Cookie', [`currId=${uid1}`])
    .expect(200)
    .then((response) => {
      // toMatchObject check that a JavaScript object matches
      // a subset of the properties of an object
      const { chats } = JSON.parse(response.text);
      const numChats = chats.length;
      expect(numChats).toBe(1);
      // expect(player).toMatchObject(testPlayer);
  }));
});

describe('Get specific user chat unit test', () => {
  test('Endpoint status code and response', () => request(app).get(`/chat/${cid.toString()}`)
  .set('Cookie', [`currId=${uid1}`])
    .expect(200)
    .then((response) => {
      // toMatchObject check that a JavaScript object matches
      // a subset of the properties of an object
      const testChat = {
          _id: cid.toString(),
          users: [uid1.toString(), uid2.toString()],
          messages: []
      }
      const { chat } = JSON.parse(response.text);
      expect(chat).toMatchObject(testChat);
  }));
});

describe('Send message to chat integration test', () => {
  test('Endpoint status code and response', () => request(app).post(`/chat/${cid.toString()}/send`)
  .set('Cookie', [`currId=${uid1}`]).send('message=testmessage')
    .expect(200)
    .then((response) => {
      const { receipt } = JSON.parse(response.text);
      expect(receipt).toBe(true);
  }));

  test('The new message is referenced in the chat', () => {
    Chat.findOne({ _id: cid }).then(result => {
        const messages = result.messages;
        expect(messages.length).toBe(1);
    });
  });

  test('The new message is in the Message collection', () => {
    Chat.findOne({ _id: cid }).then(result => {
        mid = result.messages[0];
        Message.findOne({ _id: mid }).then(mRes => {
            const txt = mRes.text;
            expect(txt).toEqual('testmessage');
            expect(mRes.from).toBe(1);
        });
    });
  });
});

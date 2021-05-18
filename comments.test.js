const request = require('supertest');
const mongoose = require('mongoose');
const app = require('./server');
const Comment = require('./models/comment_model');
const Post = require('./models/post_model');

const appPort = 5001;
const ObjectId = mongoose.Types.ObjectId;
let server;
// connect to db
const uri = 'mongodb+srv://admin:mongoose@cluster0.yvohi.mongodb.net/agileman?retryWrites=true&w=majority';
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => server = app.listen(appPort))
    .catch((err) => console.log(err));

const myId = ObjectId("605e8617983b646829c04929");
let pid;
beforeAll(async () => {
    const result = await Post.create({
        uid: myId,
        uname: 'CommentPoster',
        uhandle: 'CommentPosterYeah',
        content: 'It doesn\'t matter',
        comments: [],
        imgs: ['https://dummyimage.com/1230x320/040/fff.png&text=test+image'],
        vids: [],
        likeCount: 0
    })
    pid = result._id;
})
const deleteAll = async () => {
    await Post.deleteOne({ _id: pid }).catch(err => {
        console.error(err);
    })
    await Comment.deleteOne({ _id: cmid }).catch(err => {
        console.error(err);
    })
}

afterAll(async () => {
    await deleteAll();
    mongoose.disconnect();
    server.close();
})

let cmid;
describe('Create a new comment', () => {
    test('Status and response', (done) => {
        request(app).post(`/comments/${pid}/new`)
            .set('Cookie', [`currId=${myId}`])
            .send('content=How is this not broadcasted?')
            .expect(200)
            .then(response => {
                cmid = ObjectId(JSON.parse(response.text));
                // console.log(cmid);
                done();
            });
    });
})

describe('Like a comment', ()=>{
    test('Response and owner check', (done) =>{
        request(app).post(`/comments/${cmid}/like`)
        .send('')
        .expect(200)
        .then(response =>{
            expect(response.text).toBe('success');
            Comment.findOne({_id: cmid})
            .then(comment=>{
                expect(JSON.stringify(comment.owner)).toBe(JSON.stringify(myId));
                done();
            })
        })
    })
})
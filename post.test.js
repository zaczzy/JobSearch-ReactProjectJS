const request = require('supertest');
const mongoose = require('mongoose');
const app = require('./server');
const Post = require('./models/post_model');
const Follow = require('./models/follow_model');
const Comment = require('./models/comment_model');

const findUpdateOptions = { new: true, useFindAndModify: false };
const appPort = 5002;
const ObjectId = mongoose.Types.ObjectId;
let server;
// connect to db
const uri = 'mongodb+srv://admin:mongoose@cluster0.yvohi.mongodb.net/agileman?retryWrites=true&w=majority';
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => server = app.listen(appPort))
    .catch((err) => console.log(err));


const cleardb = async () => {
    let result = await Post.deleteOne({ _id: pid }).catch(err => console.error(err));
    let { deletedCount } = result;
    if (deletedCount !== 1) {
        console.error(`Deleted ${deletedCount} from Post`);
    }
    result = await Follow.deleteOne({ _id: followsId }).catch(err => console.error(err));
    deletedCount = result.deletedCount;
    if (deletedCount !== 1) {
        console.error(`Deleted ${deletedCount} from Follow`);
    }

    result = await Comment.deleteOne({ _id: cmId }).catch(err => console.error(err));
    deletedCount = result.deletedCount;
    if (deletedCount !== 1) {
        console.error(`Deleted ${deletedCount} from Comment`);
    }
};

afterAll(async () => {
    await cleardb();
    mongoose.disconnect();
    server.close();
});

// Post fields
let pid;
const ownerId = ObjectId(); // Post ownerId ID
let followsId;
let cmId;
const content = 'Of course, another one.'
// My ID
const myId = ObjectId();
const myUname = "keith";
const myUhandle = "roughdeck12";

beforeAll(async () => {
    let result = await Post.create({
        uid: ownerId,
        uname: 'John',
        uhandle: 'jkku',
        content: content,
        comments: [],
        imgs: ['https://dummyimage.com/600x400/000/fff.png&text=test+image'],
        vids: [],
        likeCount: 0
    }).catch(err => console.error(err))
    pid = result._id;
    // Follow the ownerId
    result = await Follow.create({
        user: myId,
        follows: ownerId
    }).catch(err => console.error(err));
    followsId = result._id;

    // Add comment to post
    result = await Comment.create({
        owner: myId,
        content: 'Goodjob',
        likeCount: 5
    }).catch(err => console.error(err));
    cmId = result._id;

    await Post.findOneAndUpdate(
        { _id: pid },
        { $push: { comments: cmId } },
        findUpdateOptions).catch(err => console.error(err));
})

describe('Get posts from the user', () => {
    test('Endpoint status code and response', () => request(app).get(`/posts/${ownerId}`)
        .expect(200)
        .then((response) => {
            const posts = JSON.parse(response.text);
            expect(posts.length).toBe(1);
            expect(posts[0].uname).toBe('John');
            expect(posts[0].content).toBe(content);
        }));
})

describe('Get posts from followed users', () => {
    test('Status code and response', () => request(app).get(`/posts`)
        .set('Cookie', [`currId=${myId}`])
        .expect(200)
        .then((response) => {
            const posts = JSON.parse(response.text);
            expect(posts.length).toBe(1);
            expect(posts[0].uname).toBe('John');
            expect(posts[0].content).toBe(content);
        }));
})

describe('Create a new post', () => {
    test('Response code, new PID, and verify created fields', () => {
        let newPid;
        request(app).post('/posts/new')
            .set('Cookie', [`currId=${myId}`])
            .send(`uname=${myUname}&uhandle=${myUhandle}&content=How\'s the weather&imgs=https://dummyimage.com/600x400/000/fff.png&text=test+image`)
            .expect(200)
            .then(res=>{
                newPid = JSON.parse(res.text);
                Post.findOneAndDelete({_id: newPid}, {content: 1}).then(res=>{;
                    expect(res.content).toBe('How\'s the weather');
                }).catch(err=>console.log(err));
            });
    });
})

describe('Delete a post', ()=>{
    test('Status code and response', async ()=>{
        const output = await Post.create({
            uid: ownerId,
            uname: 'Chubaka',
            uhandle: 'sskshufw',
            content: 'Says who?',
            comments: [],
            imgs: [],
            vids: [],
            likeCount: 0
        }).catch(err => console.error(err));
        const secondPid = output._id;
        request(app).post(`/posts/${secondPid}/del`)
        .send('').expect(200)
        .then(res=>expect(res.text).toBe('success'));
    })
})

describe('Get comments from post', () => {
    test('Comments are received', () => request(app).get(`/posts/${pid}/comments`)
        .set('Cookie', [`currId=${myId}`])
        .expect(200)
        .then((response) => {
            const comments = JSON.parse(response.text);
            expect(comments.length).toBe(1);
            expect(JSON.stringify(comments[0].owner)).toBe(JSON.stringify(myId));
            expect(comments[0].content).toBe('Goodjob');
        }));
})

describe('Like a post', () => {
    test('Status and response', () => {
        request(app).post(`/posts/${pid}/like`)
            .send('').expect(200)
            .then(res => expect(res.text).toBe('success'));
    })
})
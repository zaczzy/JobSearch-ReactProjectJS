const express = require('express');
const router = express.Router();
const Comment = require('./models/comment_model');
const Post = require('./models/post_model');
const Stream = require('./models/stream_model')
const { route } = require('./posts');

const findUpdateOptions = { new: true, useFindAndModify: false };
// prefix: /comments

router.post('/:pid/new', (req, res, next) => {
    const postId = req.params.pid;
    const comment = {
        owner: req.cookies.currId,
        content: req.body.content,
        likeCount: 0
    };
    Comment.create(comment)
        .then(result => {
            const cmid = result._id;
            Post.findOneAndUpdate(
                { _id: postId },
                { $push: { comments: cmid } },
                findUpdateOptions)
                .then(() => {
                    res.send(cmid);
                })
                .catch(err => {
                    console.error(err);
                    res.status(401).send('fail');
                })
        })
        .catch(err => {
            console.error(err);
            res.status(401).send('fail');
        });
});

router.post('/:cmid/like', (req, res, next) => {
    const commentId = req.params.cmid;
    Comment.findOneAndUpdate(
        { _id: commentId },
        { $inc: { likeCount: 1 } },
        findUpdateOptions)
        .then(() => {
            res.send('success');
        })
        .catch(err => {
            console.error(err);
            res.status(401).send('fail');
        })
})

router.post('/stream/newcomment/:sid', (req, res, next) => {
    const streamId = req.params.sid;
    console.log('body', req.body)
    const comment = {
        owner: req.cookies.currId,
        content: req.body.message,
        likeCount: 0
    };
    console.log('New comment:', comment);
    Comment.create(comment)
        .then(result => {
            const cmid = result._id;
            Stream.findOneAndUpdate(
                { _id: streamId },
                { $push: { comments: cmid } },
                findUpdateOptions)
                .then(() => {
                    res.send(cmid);
                })
                .catch(err => {
                    console.error(err);
                    res.status(401).send('fail');
                })
        })
        .catch(err => {
            console.error(err);
            res.status(401).send('fail');
        });
});

router.post('/stream/:cmid/like', (req, res, next) => {
    const commentId = req.params.cmid;
    Comment.findOneAndUpdate(
        { _id: commentId },
        { $inc: { likeCount: 1 } },
        findUpdateOptions)
        .then(() => {
            res.send('success');
        })
        .catch(err => {
            console.error(err);
            res.status(401).send('fail');
        })
})

router.get('/find/tag/:tag', (req, res, next) => {
    const tag = '#' + req.params.tag;
    Comment.find({ tags: tag }).populate("owner")
        .then(results => {
            res.json({ message: 'success', comments: results })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: 'Could not complete search' })
        })
})

router.get('/find/mention/:handle', (req, res, next) => {
    const handle = '@' + req.params.handle;
    console.log('Finding handle', handle)
    Comment.find({ mentions: handle }).populate("owner")
        .then(results => {
            res.json({ message: 'success', comments: results })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: 'Could not complete search' })
        })
})

module.exports = router;

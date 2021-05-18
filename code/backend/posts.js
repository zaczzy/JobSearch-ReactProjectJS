const express = require('express');
const router = express.Router();

const Post = require('./models/post_model');
const Follow = require('./models/follow_model');
const Comment = require('./models/comment_model');
const findUpdateOptions = { new: true, useFindAndModify: false };


router.get('/', (req, res) => {
    const currId = req.cookies.currId;
    Follow.find({ user: currId }, { _id: 0, follows: 1 })
        .then(followedUsers => {
            followedUsers = followedUsers.map(el => el.follows);
            Post.find({ uid: { $in: followedUsers } })
                .sort({ updatedAt: -1 })
                .lean()
                .populate('uid', 'displayName handle profilePic')
                .then(postsFromUsers => {
                    res.json(postsFromUsers);
                })
                .catch(error => console.log(error));
        })
        .catch(error => console.error(error));
});
// get post from user
router.get('/:id', (req, res) => {
    const user = req.params.id;
    Post.find({ uid: user })
        .sort({ updatedAt: -1 })
        .lean()
        .populate('uid', 'displayName handle profilePic')
        .then(postsFromUser => res.json(postsFromUser))
        .catch(error => console.log(error));
});
// get specific post by id
router.get('/p/:pid', (req, res) => {
    const pid = req.params.pid;
    Post.findOne({ _id: pid })
        .populate('uid')
        .populate({ path: 'comments', populate: { path: 'owner' } })
        .then(post => res.json(post))
        .catch(err => console.log(err));
})
// create a new post
router.post('/new', (req, res) => {
    let post = {
        uid: req.cookies.currId,
        content: req.body.content,
        comments: [],
        imgs: req.body.imgs,
        audios: req.body.audios,
        tags: req.body.tags,
        mentions: req.body.mentions,
        likeCount: 0
    };

    if (req.body.imgs) {
        if (typeof req.body.imgs == 'string') { post.imgs.push(req.body.imgs); }
        else { post.imgs.concat(req.body.imgs); }
    }
    if (req.body.vids) {
        if (typeof req.body.vids == 'string') { post.vids.push(req.body.vids); }
        else { post.vids.concat(req.body.vids); }
    }
    Post.create(post)
        .then(result => res.send(result._id))
        .catch(err => {
            console.error(`Failed to create post: ${err}`);
            res.status(401).send('error /new');
        })
});

// comment on post
router.post('/cm/:pid', (req, res) => {
    const pid = req.params.pid;
    const comment = {
        content: req.body.content,
        owner: req.cookies.currId,
        tags: req.body.tags,
        mentions: req.body.mentions
    }
    Comment.create(comment)
        .then(result => {
            const cmid = result._id;
            Post.findOneAndUpdate({ _id: pid }, { $push: { comments: cmid } })
                .then(result => { res.send('success') })
                .catch(err => console.log(err));
        })
        .catch(err => {
            console.error(`Failed to create comment: ${err}`);
            res.status(401).send('error /cm/:pid');
        })
})

router.post('/cm/del/:cmid', (req, res) => {
    const cmid = req.params.cmid;
    Comment.findOneAndDelete({_id: cmid})
        .then(result => {
            Post.findOneAndUpdate({comments: cmid}, {$pull: {comments: cmid}})
            .then(result => res.send('success'))
            .catch(err=>console.log(err));
        })
        .catch(err => {
            console.error(err);
            res.status(401).send('error /cm/del/:pid');
        })
})

router.post('/cm/update/:cmid', (req, res) => {
    const cmid = req.params.cmid;
    const content = req.body.content;
    Comment.findOneAndUpdate({_id: cmid}, {content: content})
        .then(res.send('success'))
        .catch(err => {
            console.error(err);
            res.status(401).send('error /cm/update/:pid');
        })
})

router.post('/:pid/del', (req, res) => {
    const pid = req.params.pid;
    Post.deleteOne({ _id: pid })
        .then(() => res.send('success'))
        .catch(err => {
            console.error(`Failed to delete post: ${err}`);
            res.status(401).send('fail');
        });
});


router.post('/like/:pid/', (req, res) => {
    const pid = req.params.pid;
    const upVote = req.body.like;
    Post.findOneAndUpdate(
        { _id: pid },
        { $inc: { likeCount: upVote ? 1 : -1 } },
        findUpdateOptions)
        .then(() => res.send('success'))
        .catch(err => {
            console.error(err);
            res.status(401).send('fail')
        })
})

router.post("/:pid/edit", (req, res, next) => {
    const pid = req.params.pid;
    const newPost = req.params.newPost

    Post.findOne({ _id: pid }, async (err, userObj) => {
      if (err) throw err;
      if (userObj) {
        userObj.content = newPost;
        userObj.save()
        .then((usr) => res.send(`Successfully changed post.` ))
        .catch((err) => res.send(`Could not change post.`));
      }
      if (!userObj) {
        res.send(`Cannot find user`)
      }
    });
  });

router.get('/find/tag/:tag', (req, res, next) => {
    const tag = '#' + req.params.tag;
    Post.find({ tags: tag }).populate("uid")
        .then(results => {
            res.json({ message: 'success', posts: results })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: 'Could not complete search' })
        })
})

router.get('/find/mention/:handle', (req, res, next) => {
    const handle = '@' + req.params.handle;
    console.log('Finding handle', handle)
    Post.find({ mentions: handle }).populate("uid")
        .then(results => {
            res.json({ message: 'success', posts: results })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: 'Could not complete search' })
        })
})

router.get('/paged/:pageNum', (req, res, next) => {
    const currId = req.cookies.currId;
    const skipPosts = (req.params.pageNum - 1) * 10;
    Follow.find({ user: currId }, { _id: 0, follows: 1 })
        .then(followedUsers => {
            followedUsers = followedUsers.map(el => el.follows);
            Post.find({ uid: { $in: followedUsers }, hiddenFrom: {$nin: [currId] } })
                .sort({updatedAt: -1})
                .skip(skipPosts)
                .limit(10)
                .lean()
                .populate('uid', 'displayName handle profilePic')
                .then(postsFromUsers => {
                    res.json(postsFromUsers);
                })
                .catch(error => console.log(error));
        })
        .catch(error => console.error(error));
});

router.post('/hide/:pid', (req, res, next) => {
  const pid = req.params.pid;
  const currId = req.body.from;
  console.log('currId', currId)
  Post.findOneAndUpdate(
    { _id: pid },
    {$push: { hiddenFrom: currId } },
    { new: true, useFindAndModify: false }
  )
  .then(results => {
    res.json({message: 'success', posts: results})
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({message: 'Could not complete search'})
  })
})

module.exports = router;

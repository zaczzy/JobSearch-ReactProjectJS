const express = require('express');
const router = express.Router();

// Get models used
const User = require('./models/user_model');
const Message = require('./models/message_model');
const Chat = require('./models/chat_model');
const Follow = require('./models/follow_model');
const Stream = require("./models/stream_model")
// url prefix: /user

const findUpdateOptions = { new: true, useFindAndModify: false };

router.get('/followed', (req, res) => {
    const currId = req.cookies.currId;
    Follow.find({ user: currId }, { _id: 0, follows: 1 })
        .then(followedUserIds => {
            followedUserIds = followedUserIds.map(el => el.follows);
            User.find({ _id: { $in: followedUserIds } })
                .then(users => {
                    res.json(users);
                })
                .catch(error => res.json({ status: 500, message: error }));
        })
        .catch(error => console.error(error));
});

router.get('/followers', (req, res) => {
    const currId = req.cookies.currId;
    Follow.find({ follows: currId }, { _id: 0, user: 1 })
        .then(followedUserIds => {
            followedUserIds = followedUserIds.map(el => el.user);
            User.find({ _id: { $in: followedUserIds } })
                .then(users => {
                    res.json(users);
                })
                .catch(error => res.json({ status: 500, message: error }));
        })
        .catch(error => console.error(error));
});

router.get('/suggest', (req, res) => {
    const currId = req.cookies.currId;
    Follow.find({ user: currId }, { _id: 0, follows: 1 })
        .then(followedUserIds => {
            followedUserIds = followedUserIds.map(el => el.follows);
            followedUserIds.push(currId);
            User.find({ _id: { $nin: followedUserIds }, blockedBy: {$nin: [currId] } }).limit(3)
                .then(users => {
                    res.json(users);
                })
                .catch(error => res.json({ status: 500, message: error }));
        })
        .catch(error => console.error(error));
});

router.get('/chat/:id', (req, res) => {
    const currId = req.cookies.currId;
    const otherId = req.params.id;
    const chat = { 'users': [currId, otherId], 'messages': [] };
    // check if chat exists
    Chat.find({ 'users': { $all: [currId, otherId] }})
    .then(existsRes => {
      console.log('Chat exists', existsRes);
      if(existsRes.length > 0){
        res.redirect(`/api/chat/${existsRes[0]._id.toHexString()}`)
        return
      } else {
        console.log('Trying create chat', chat);
        Chat.create(chat)
            .then(result => {
                console.log('Created new Chat: \n', result);
                // TODO: fix API, boilerplate
                const insertedId = result._id.toHexString();
                res.redirect(`/api/chat/${insertedId}`);
            })
            .then(updatedDoc => {
                console.log('UpdatedDoc', updatedDoc)
                if (updatedDoc) {
                    res.json({ status: 200, message: "success" });
                } else {
                    res.json({ status: 500, message: "error" });
                }
            }).catch(err => console.error(`Failed to find and update document: ${err}`));
      }
    })
});

router.get('/call/:id', (req, res) => {
    const currId = req.cookies.currId;
    const otherId = req.params.id;
    const newStream = {
        host: currId,
        userIds: [otherId],
        name: req.body.name,
        description: req.body.description
    }
    Stream.insertOne(newStream)
        .then(result => {
            // TODO: fix API, boilerplate
            res.redirect(`/api/stream/${result._id}`);
        })
});

router.get('/join/:id', (req, res) => {
    const currId = req.cookies.currId;
    const otherId = req.params.id;
    const stream = Stream.findOneAndUpdate(
        { host: otherId },
        { $push: { userIds: currId } },
        findUpdateOptions)
        .then(() => {
            res.send('success');
        })
        .catch(err => {
            console.error(err);
            res.status(401).send('fail');
        })
});


router.post('/follow/:id', (req, res) => {
    const currId = req.cookies.currId;
    const otherId = req.params.id;
    const relationship = {
        user: currId,
        follows: otherId
    }
    console.log('relationship', relationship)
    // check if I'm blocked by tgt
    User.find({_id: currId, blockedBy: {$in: [otherId]}})
      .then(blockRes => {
        console.log('Block res,', blockRes)
        if(blockRes.length > 0) {
          res.json({message: 'Sorry you cannot follow this user'})
          console.log('Is Blocked')
          return
        } else {
          // check if exists
          Follow.find(relationship)
            .then(findRes => {
              console.log('FindRes is:', findRes)
              if(findRes.length === 0) {
                Follow.create(relationship)
                    .then(result => res.send(result._id))
                    .catch(err => {
                        console.log(`Failed to follow: ${err}`);
                        res.status(401).send('error');
                    });
              } else {
                res.status(400).json({message: 'User already followed'})
              }
            })
        }
      })
});

router.post('/unfollow/:id', (req, res) => {
    const currId = req.cookies.currId;
    const otherId = req.params.id;
    const relationship = {
        user: currId,
        follows: otherId
    }
    // check if exists
    Follow.find(relationship)
      .then(findRes => {
        if(findRes.length > 0) {
          Follow.deleteOne(relationship)
              .then(res.json({message: 'success'}))
              .catch(err => {
                  console.error(`Failed to unfollow: ${err}`);
                  res.status(401).send('fail');
              });
        } else {
          res.status(400).json({message: 'User not followed'})
        }
      })
});

router.post('/block/:id', (req, res) => {
    const currId = req.cookies.currId;
    const otherId = req.params.id;
    // check if exists
    User.find({ _id: otherId, blockedBy: currId })
    .then(findRes => {
      if(findRes.length === 0) {
        // not blocked
        User.findOneAndUpdate(
          {_id: otherId},
          {$push: { blockedBy: currId }}
        )
        .then(updateRes => {
          res.json({message: 'success'})
        })
      } else {
        // already blocked
        res.status(400).json({message: 'User already blocked'})
      }
    })
});
router.post('/avatar', (req, res)=>{
  const currId = req.cookies.currId;
  const imagePath = req.body.imagePath;
  User.findOneAndUpdate({_id: currId}, {profilePic: imagePath})
  .then(updatedUser => res.send('success'))
  .catch(err=> res.status(401).send('fail'));
})

router.get('/avatar', (req, res)=>{
  const currId = req.cookies.currId;
  const imagePath = req.body.imagePath;
  User.findOne({_id: currId}, {profilePic: 1, _id: 0})
  .then(myUser => {
    res.send(myUser.profilePic);
  })
  .catch(err=> res.status(400).send('fail to get avatar'));
})

router.post('/unblock/:id', (req, res) => {
    const currId = req.cookies.currId;
    const otherId = req.params.id;
    // check if exists
    User.find({ _id: otherId, blockedBy: currId })
    .then(findRes => {
      if(findRes.length > 0) {
        // not blocked
        User.findOneAndUpdate(
          {_id: otherId},
          {$pull: { blockedBy: currId }}
        )
        .then(updateRes => {
          res.json({message: 'success'})
        })
      } else {
        // already blocked
        res.status(400).json({message: 'User not blocked'})
      }
    })
});

router.get('/find/:id', (req, res) => {
    const tgtId = req.params.id;
    User.findById(tgtId)
        .then(result => {
            res.json({ profile: result });
        }).catch(error => res.json({ status: 500, message: error }));
});

router.get('/search/:handle', (req, res) => {
    const currId = req.cookies.currId;
    const tgthandle = req.params.handle;
    User.find({ handle: {$regex : `.*${tgthandle}.*`}})
        .then(result => {
            res.json({ profiles: result });
        }).catch(error => res.json({ status: 500, message: error }));
});

module.exports = router;

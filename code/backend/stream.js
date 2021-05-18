const express = require('express');
const router = express.Router();

const config = require('./config');
const { chatToken, videoToken, voiceToken } = require('./tokens');

// Get models used
const Stream = require("./models/stream_model")
const User = require("./models/user_model")
const Comment = require("./models/comment_model")

const findUpdateOptions = { new: true, useFindAndModify: false };

const sendTokenResponse = (token, res) => {
  res.set('Content-Type', 'application/json');
  res.send(
    JSON.stringify({
      token: token.toJwt()
    })
  );
};

router.get('/list', (req, res) => {
  const currId = req.cookies.currId;
  // check which users blocked
  User.find({blockedBy: {$nin: [currId] }})
  .then(userRes => {
    const uids = userRes.map(user => user._id);
    Stream.find({host: {$in: uids}, ended: false})
    .then(result => {
      res.json(result)
    })
  })
});

router.get('/comments/:sid', (req, res) => {
  const sid = req.params.sid;
  // .populate("comments")
  Stream.find({_id: sid}).populate({
      path: 'comments',
      populate: { path: 'owner' }
  })
  .then(result => {
    console.log('Comment result', result)
    res.json({stream: result})
  })
});

router.get('/end/:sid', (req, res) => {
  const sid = req.params.sid;
  // .populate("comments")
  Stream.findOneAndUpdate({_id: sid}, { ended: true })
  .then(result => {
    console.log('Strem del', result)
    res.json({result: result})
  })
});

router.post('/create', (req, res) => {
  let stream = {
      host: req.cookies.currId,
      title: req.body.title,
      userIds: [],
      comments: [],
      ended: false
  };
  Stream.create(stream)
  .then(newRes => {
    console.log('Stream created', newRes);
    res.json(newRes)
  })
  .catch(err => res.status(500).json({ message: error }))
})

router.post('/add', (req, res) => {
  const currId = req.cookies.currId;
  const sid = req.body.streamId;
  Stream.findOneAndUpdate(
      { _id: sid },
      {$push: { userIds: currId } },
      { new: true, useFindAndModify: false }
  )
  .then(updatedStream => {
      // console.log('Updated chat:', updatedChat);
      res.json({receipt: true, sid: sid });
  })
  .catch(err => res.status(500).json({ message: error }))
})

router.get('/chat/token', (req, res) => {
  const identity = req.query.identity;
  const token = chatToken(identity, config);
  sendTokenResponse(token, res);
});

router.post('/chat/token', (req, res) => {
  const identity = req.body.identity;
  const token = chatToken(identity, config);
  sendTokenResponse(token, res);
});

router.get('/video/token', (req, res) => {
  const identity = req.query.identity;
  const room = req.query.room;
  const token = videoToken(identity, room, config);
  sendTokenResponse(token, res);
});

router.post('/video/token', (req, res) => {
  const identity = req.body.identity;
  const room = req.body.room;
  const token = videoToken(identity, room, config);
  sendTokenResponse(token, res);
});

router.get('/voice/token', (req, res) => {
  const identity = req.body.identity;
  const token = voiceToken(identity, config);
  sendTokenResponse(token, res);
});

router.post('/voice/token', (req, res) => {
  const identity = req.body.identity;
  const token = voiceToken(identity, config);
  sendTokenResponse(token, res);
});

module.exports = router;

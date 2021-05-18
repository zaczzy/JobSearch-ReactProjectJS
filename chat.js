const express = require('express');
const router = express.Router();
const ObjectId = require('mongoose').Types.ObjectId;
// Get models used
const Message = require('./models/message_model');
const Chat = require('./models/chat_model');
// url prefix: /chat


router.get('/', (req, res, next) => {
    const currId = req.cookies.currId;
    Chat.find( { users: currId } )
    .sort( { updatedAt: -1} )
    .populate("users")
    .then(myChats => {
      // return sorted by most recently modified
      res.json({chats: myChats});
    })
    .catch(error => {res.json({status: 500, message: error})});
});

router.get('/:cid', (req, res, next) => {
    const currId = req.cookies.currId;
    const cid = ObjectId(req.params.cid);
    Chat.find( { _id: cid, users: currId } )
    .then(result => {
        // check if chat exists
        const resLen = result.length;
        if(resLen === 0) {
            res.status(404).json({message: 'This chat could not be found'});
        } else {
            // get chat populated with messages and users
            Chat.findById(cid).populate("messages").populate("users")
            .then(popRes => {
                res.json({ chat: popRes });
            })
            .catch(err => {res.status(500).json({message: error})});
        }
    })
    .catch(error => {res.status(500).json({message: error})});
});

router.post('/:cid/send', (req, res, next) => {
    const currId = req.cookies.currId;
    const cid = req.params.cid;
    const text = req.body.message;
    const newMessage = { 'text': text };

    Chat.find( { _id: cid, users: currId } )
    .then(result => {
        // check if chat exists
        const resLen = result.length;
        if(resLen === 0) {
            res.status(404).json({message: 'This chat could not be found'});
        } else {
            // check idx of usr
            const amIFirst = (result[0].users[0].toString() === currId);
            if (amIFirst) {
                newMessage.from = 0;
            } else {
                newMessage.from = 1;
            }
            // create message object in db
            Message.create(newMessage)
            .then(resMsg => {
                // console.log('Created new message:', resMsg);
                Chat.findOneAndUpdate(
                    { _id: cid },
                    {$push: { messages: resMsg._id } },
                    { new: true, useFindAndModify: false }
                )
                .then(updatedChat => {
                    // console.log('Updated chat:', updatedChat);
                    res.json({receipt: true, cid: cid });
                })
                .catch(err => {
                    console.error('Error updating chat:', err);
                    res.status(500).json({message: 'Message failed to send'})
                })
            })
            .catch(err => {
                console.error(err);
                res.status(500).json({message: 'Message failed to send'})
            });
        }
    })
    .catch(error => {res.status(500).json({message: error})});
});

router.post('/:cid/upload', (req, res, next) => {
    const currId = req.cookies.currId;
    const cid = req.params.cid;
    console.log('Got body', req.body);
    const text = "";
    let newMessage;
    if(req.body.type === 0) {
      // img
      newMessage = { 'text': text, imageURL: req.body.imgurl }
    } else {
      newMessage = { 'text': text, audioURL: req.body.audiourl }
    }
    Chat.find( { _id: cid, users: currId } )
    .then(result => {
        console.log('Result in send', result);
        // check if chat exists
        const resLen = result.length;
        if(resLen === 0) {
            res.status(404).json({message: 'This chat could not be found'});
        } else {
            // check idx of usr
            const amIFirst = (result[0].users[0].toString() === currId);
            if (amIFirst) {
                newMessage.from = 0;
            } else {
                newMessage.from = 1;
            }
            console.log('New message', newMessage);
            // create message object in db
            Message.create(newMessage)
            .then(resMsg => {
                // console.log('Created new message:', resMsg);
                Chat.findOneAndUpdate(
                    { _id: cid },
                    {$push: { messages: resMsg._id } },
                    { new: true, useFindAndModify: false }
                )
                .then(updatedChat => {
                    // console.log('Updated chat:', updatedChat);
                    res.json({receipt: true, cid: cid });
                })
                .catch(err => {
                    console.error('Error updating chat:', err);
                    res.status(500).json({message: 'Message failed to send'})
                })
            })
            .catch(err => {
                console.error(err);
                res.status(500).json({message: 'Message failed to send'})
            });
        }
    })
    .catch(error => {res.status(500).json({message: error})});
});
module.exports=router;

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatSchema = new Schema({
  users: [
    {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  ],
  messages: [
    {
      type: Schema.Types.ObjectId,
      ref: "Message"
    }
  ]
  // timstamps = true automatically adds Date fields for createdAt and updatedAt
}, { timestamps: true });

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;

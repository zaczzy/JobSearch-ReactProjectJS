const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  text: {
    type: String,
  },
  from: {
    type: Number,
    required: true
  },
  imageURL: {
    type: String,
  },
  audioURL: {
    type: String,
  },
  videoURL: {
    type: String,
  }
  // timstamps = true automatically adds Date fields for createdAt and updatedAt
}, { timestamps: true });

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;

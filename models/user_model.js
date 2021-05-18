const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  handle: {
    type: String,
    required: true
  },
  displayName: {
    type: String,
    required: true
  },
  profilePic: {
    type: String
  },
  is_locked_out: {
    type: Boolean
  },
  consecutive_incorrect_logins: {
    type: Number
  },
  last_incorrect_login: {
    type: Date
  },
  blockedBy: [
    {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  ]
  // timestamps = true automatically adds Date fields for createdAt and updatedAt
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    uid: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    content: {
        type: String,
        required: true
    },
    comments:[
        {
            type: Schema.Types.ObjectId,
            ref: "Comment"
        }
    ],
    imgs : [
        {
            type: String
        }
    ],
    audios: [
        {
            type: String
        }
    ],
    likeCount: {
        type: Number,
        required:true
    },
    tags: [
      {
        type: String
      }
    ],
    mentions: [
      {
        type: String
      }
    ],
    hiddenFrom: [
      {
        type: Schema.Types.ObjectId,
        ref: "User"
      }
    ],
}, {timestamps: true});

const Post = mongoose.model('Post', postSchema);
module.exports = Post;

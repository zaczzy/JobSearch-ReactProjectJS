const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const streamSchema = new Schema({
 host: {
     type: Schema.Types.ObjectId,
     ref: "User",
     required:true
 },
 userIds:[
     {
        type:Schema.Types.ObjectId,
        ref: "User"
     }
 ],
 comments:[
     {
         type: Schema.Types.ObjectId,
         ref: "Comment"
     }
 ],
 title: {
   type: String,
   required: true
 },
 ended: {
   type: Boolean,
   required: true
 }
}, { timestamps: true });

const Stream = mongoose.model('Stream', streamSchema);

module.exports = Stream;

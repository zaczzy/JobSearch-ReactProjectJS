const { mode } = require('crypto-js');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const followsSchema = new Schema({
    user : {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    follows: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User"
    }
})

const Follow = mongoose.model("Follow", followsSchema);
module.exports = Follow;
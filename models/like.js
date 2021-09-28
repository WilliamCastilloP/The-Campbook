const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const likeSchema = new Schema({
    body: Number, 
})

module.exports = mongoose.model('Like', likeSchema)
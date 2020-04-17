const mongoose = require('mongoose')
const { Schema } = mongoose; // destructuring, equiv to const Schema = mongoose.Schema

const userSchema = new Schema({
  googleId: String
})

mongoose.model('users', userSchema);
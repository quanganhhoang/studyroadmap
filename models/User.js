import { Schema } from 'mongoose';
import mongoose from "mongoose";


const userSchema = new Schema({
  googleId: String,
  full_name: String,
  

})

mongoose.model('users', userSchema);
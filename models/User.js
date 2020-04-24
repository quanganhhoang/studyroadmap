import { Schema } from 'mongoose';
import mongoose from "mongoose";


const userSchema = new Schema({
  googleId: String,
  full_name: String,  
  tags: [{String}],  // interested tags
})

mongoose.model('users', userSchema);
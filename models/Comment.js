import {ObjectID} from  'mongodb';
import mongoose from "mongoose";
import {Schema} from  'mongoose';


export const COMMENT_TYPE = {
    ROADMAP_COMMENT: 0, // original file uploaded by user
    STEP_COMMENT: 1,
};


const commentSchema = new Schema({
  comment_type: Number, // COMMENT_TYPE.ROADMAP_COMMENT or STEP_COMMENT
  userId: [{ type: Schema.Types.ObjectId, ref: 'users' }], 
  content: String,
  rating: Number, //rating for the parent post
  votes: Number
})

mongoose.model('comments', commentSchema);
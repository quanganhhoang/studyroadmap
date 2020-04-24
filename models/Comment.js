import {ObjectID} from  'mongodb';
import mongoose from "mongoose";
import {Schema} from  'mongoose';


export const COMMENT_TYPE = {
    ROADMAP_COMMENT: 0, // original file uploaded by user
    MILESTONE_COMMENT: 1,
};


const commentSchema = new Schema({
  comment_type: { type: Number, required: true}, // COMMENT_TYPE.ROADMAP_COMMENT or MILESTONE_COMMENT
  roadmap: { type: Schema.Types.ObjectId, ref: 'roadmaps', default: null}, // if content_type == ROADMAP_COMMENT
  milestone: { type: Schema.Types.ObjectId, ref: 'milestones', default: null }, // if content_type == MILESTONE_COMMENT
  userId: [{ type: Schema.Types.ObjectId, ref: 'users' }], 
  content: { type: String, required:true},
  rating: {type: Number, default: 0.0, required: true}, //rating for the parent post
  votes: {type: Number, default: 0, required: true}
})

mongoose.model('comments', commentSchema);
import {ObjectID} from  'mongodb';
import mongoose from "mongoose";
import {Schema} from  'mongoose';


export const COMMENT_TYPE = {
    ROADMAP_REPLY: "roadmaps", // original file uploaded by user
    TIP_REPLY: "tips", // comments on tips
    COMMENT_REPLY: "comments", // comments -> comments reply
};


const commentSchema = new Schema({
    parent_roadmap: { type: Schema.Types.ObjectId, ref: 'roadmaps', default: null}, // if content_type == ROADMAP_COMMENT
    parent_milestone: { type: Schema.Types.ObjectId, ref: 'milestones', default: null }, // if content_type == TIPS
    parent_comment: { type: Schema.Types.ObjectId, ref: 'milestones', default: null }, // if content_type == COMMENT_REPLY
    userId: { type: Schema.Types.ObjectId, ref: 'users' }, 
    content: { type: String, required:true },
    votes: {type: Number, default: 0, required: true},
})

mongoose.model('comments', commentSchema);
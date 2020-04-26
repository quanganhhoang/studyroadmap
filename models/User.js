import { Schema } from 'mongoose';
import mongoose from "mongoose";


export const VOTE_TYPE = {
    ROADMAP_VOTE: "roadmaps",
    MILESTONE_VOTE: "milestones",
    TIP_VOTE: "tips",
    COMMENT_VOTE: "comments",
}

const userSchema = new Schema({
    googleId: String,
    full_name: String,  
    tags: [{String}],  // interested tags
    tracked_roadmaps: [{
        roadmap: {type: Schema.Types.ObjectId, ref: "roadmaps", required: true},
        progress: {type: Number, default: 0} // progress 
    }]
})

mongoose.model('users', userSchema);
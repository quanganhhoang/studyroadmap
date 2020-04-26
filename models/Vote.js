import { Schema } from 'mongoose';
import mongoose from "mongoose";


export const VOTE_TYPE = {
    ROADMAP_VOTE: "roadmaps",
    MILESTONE_VOTE: "milestones",
    TIP_VOTE: "tips",
    COMMENT_VOTE: "comments",
}

const voteSchema = new Schema({
    type: {type: String, required: true}, //VOTE_TYPE enum
    userId: {type: Schema.Types.ObjectId, ref: "users"},
    roadmap: {type: Schema.Types.ObjectId, ref: "roadmaps"},
    tip: {type: Schema.Types.ObjectId, ref: "milestones"},
    milestone: {type: Schema.Types.ObjectId, ref: "milestones"},
    comment: {type: Schema.Types.ObjectId, ref: "roadmaps"},
    value:  {type: Number, required: true}
})


class Vote {
    static async getTotalVotes(filter) {
        /*
            filter example:
                {
                    userId: 
                    roadmap:
                } 
        */
        try {
            let sumVote =   (await this.aggregate([
                    { "$match": filter},
                    { "$group": { "_id": null, "total": { "$sum": "$value" }}}
            ]))[0].total;

            return sumVote;
        } catch (e) {
            console.error(e);
            return -1;
        }
    }
}

voteSchema.loadClass(Vote);
mongoose.model('votes', voteSchema);
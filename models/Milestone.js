import {ObjectID} from  'mongodb';
import mongoose from "mongoose";
import {Schema} from  'mongoose';


const milestoneSchema = new Schema({
    name: { type: String, required: true}, 
    roadmaps: [{ type: Schema.Types.ObjectId, ref: 'roadmaps' }], // All the roadmaps that include this milestone
    tips: [{ // allowing users to give tips to a specific milestone
            userId: { type: Schema.Types.ObjectId, ref: 'users'},
            content: String, // author comment on the this milestone
            votes: { type: Number, default: 0 }
    }],
    mentors: [{ type: Schema.Types.ObjectId, ref: 'users' }],
    comments: [{ type: Schema.Types.ObjectId, ref: 'comments' }], // user comments
    tags: [{type: Schema.Types.ObjectId, ref: 'tags'}],
    language: {type: String, default: "english"},
});



class Milestone {
    static async add(payload) {
        /** 
            payload format:
            {   
                _id: Optional // if exists means that we need to add to existing one
                name: String --- name of the Milestone
                roadmaps: [List of roadmaps' ObjecIds that include this milestone], this is optional
                tips: [All the tips that users give on this roadmap],
                tags: [List of tag objectids]
                language: optional, default is "english"
            }
        **/
        let doc = await this.findOneAndUpdate({
            _id: payload._id ? (new ObjectId(payload._id)) : (new mongoose.mongo.ObjectId())
        }, {
            $setOnInsert: {
                name: payload.name,
                language: payload.language ? payload.language : "english"
            },
            $push: {
                roadmaps: {
                    $each: payload.roadmaps ? payload.roadmaps : []
                },
                tips: {
                    $each: payload.tips
                },
                tags: {
                    $each: payload.tags
                }
            }
        }, 
        {upsert: true, new: true})
        .exec()
        .catch(e => console.error(e));

        if(!doc) 
            throw "Failed to create new milestone: " + payload.name;

        return doc;
    }

    static async update(_id, updateQuery) {
        if(!(_id instanceof ObjectId)) 
            _id = new ObjectId(_id);

        let milestoneDoc = await this.findOneAndUpdate({
            _id: _id
        }, updateQuery, {new: true})
        .exec()
        .catch(e => console.error(e));

        if(!milestoneDoc)
            throw "Failed to update milestone _id: "+ _id +". Query: " + updateQuery;

        return milestoneDoc;
    }
}

milestoneSchema.loadClass(Milestone);

mongoose.model('milestones', milestoneSchema);

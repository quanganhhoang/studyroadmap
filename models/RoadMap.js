import {ObjectID} from  'mongodb';
import mongoose from "mongoose";
import {Schema} from  'mongoose';


export const ROADMAP_STATUS = {
    UNPUBLISHED: 0, // still editing
    PUBLIC: 1, // published and set as public
    PRIVATE: 2,
};


const roadmapSchema = new Schema({
    name: { type: String, required: true}, 
    userId: { type: Schema.Types.ObjectId, ref: 'users', required: true}, //user id of author
    description: { type: String, required: true},
    milestones: [{type: Schema.Types.ObjectId, ref: 'milestones', required: true}],
    votes: {type: Number, default: 0, required: true},
    tags: [{type: Schema.Types.ObjectId, ref: 'tags'}],
    comments: [{type: Schema.Types.ObjectId, ref: 'comments'}],
    status: { type: Number, default: 0}, // ROADMAP_STATUS ENUM
    language: {type: String, default: "english"}
});


const Tags = mongoose.model('tags');
const Milestones = mongoose.model('milestones');

class Roadmap {
    static async update(_id, updateQuery) {
        if(!(_id instanceof ObjectId)) 
            _id = new ObjectId(_id);

        let doc = await this.findOneAndUpdate({
            _id: _id
        }, updateQuery, {new: true})
        .exec()
        .catch(e => console.error(e));

        if(!doc)
            throw "Failed to update RoadMap _id: "+ _id +". Query: " + updateQuery;

        return doc;
    }

    static async add(payload) {
        /**
            payload format: 
            {
                "name": ROADMAP_NAME,
                "userId": Author ObjectId,
                "description": "..."
                "milestones": [ObjectIds of milestones],
                "tags": [ObjectId of tags],
                "language": OPTIONAL, default is english
                "status": ROADMAP_STATUS enum
            } 
        **/
        let roadmapDoc = await this.create({
            name: payload.name,
            userId: payload.userId,
            description: payload.description,
            milestones: payload.milestones,
            tags: payload.tags,
            language: payload.language ? payload.language : "english",
            status: payload.status ? payload.status: ROADMAP_STATUS.UNPUBLISHED,
            votes: 0,
        }).catch(e => console.error(e));

        if(!roadmapDoc)
            throw "Error while adding new roadmap";

        // update each corresponding milestones concurrently
        // for each milestone, attach the roadmapId to link the mileestone with this roadmap
        await Promise.all(payload.milestones.map(milestoneId => {
            Milestones.update(milestoneId, {
                "$addToSet": {
                    roadmaps: roadmapDoc._id
                }
            })
        })).catch(e => {
            console.error(e)
            throw e;
        });

        return roadmapDoc;
    }
}
roadmapSchema.loadClass(Roadmap);
console.log("here");
mongoose.model('roadmaps', roadmapSchema);
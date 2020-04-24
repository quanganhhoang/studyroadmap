import {ObjectID} from  'mongodb';
import mongoose from "mongoose";
import {Schema} from  'mongoose';


const tagSchema = new Schema({
  name: {type: String, required: true}, // included roadmaps
  roadmaps: [{ type: Schema.Types.ObjectId, ref: 'roadmaps' }], 
  milestones: [{ type: Schema.Types.ObjectId, ref: 'milestones' }], 
  relevant_tags: [{ type: Schema.Types.ObjectId, ref: 'tags'}], //Usecase: recommendation system, maybe use collaberative filtering for this
});

class Tag {

    static async add(tagName) {
        let existingTag = await this.findOneAndUpdate({
            name: tagName,
        },
        {
            "$setOnInsert": {
                name: tagName,
                relevant_tags: [],
                roadmaps: []
            }
        }, // document to insert when nothing was found
        { upsert: true, new: true }).exec().catch(e => console.error(e));

        return existingTag;
    }
}

tagSchema.loadClass(Tag);
mongoose.model('tags', tagSchema);
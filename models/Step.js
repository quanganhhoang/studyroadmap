import {ObjectID} from  'mongodb';
import mongoose from "mongoose";
import {Schema} from  'mongoose';


const stepSchema = new Schema({
  roadmaps: [{ type: Schema.Types.ObjectId, ref: 'steps' }], // included roadmaps
  original_authors: [{ type: Schema.Types.ObjectId, ref: 'users' }], //included
  name: String, 
  description: String,
  resources: String,
  mentors: [{ type: Schema.Types.ObjectId, ref: 'users' }],
  comments: [{ type: Schema.Types.ObjectId, ref: 'comments' }] 
})

mongoose.model('steps', stepSchema);
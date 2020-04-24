import {ObjectID} from  'mongodb';
import mongoose from "mongoose";
import {Schema} from  'mongoose';


const roadmapSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'users' }, //user id of author
  steps: {type: Schema.Types.ObjectId, ref: 'steps'},
  votes: Number,
  name: String, 
  ratings: Number,
  tags: [String],
  comments: [{type: Schema.Types.ObjectId, ref: 'comments'}]
})

mongoose.model('roadmaps', roadmapSchema);
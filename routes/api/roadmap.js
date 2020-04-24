import express from "express";
import mongoose from "mongoose";
import {ObjectID} from  'mongodb';

import {isAuthenticated} from "./utils/helper.js";


const Roadmaps = mongoose.model("roadmaps");
const Users = mongoose.model("users");
const Milestones = mongoose.model("milestones");
const Tags = mongoose.model("tags");

//checking payload middleware
function checkPayloadExist(req, res, next) {
    let payload = req.body;
    if(!Object.keys(payload).length){
        res.status(400).json({
            status: 0,
            error: "Missing payload"
        })
        return;
    }
    return next();
}


async function generateCreatePayload(clientPayload, user) {
    /**
        clientPayload example
        "name": "Roadmap Name",
        "tags": ["react", "computer science", "programming", "cooking"],
        "description": "Blah Blah",
        "milestones": [
            {
                "name": Milestone 1
                "milestoneId": SOME_ID_HERE in string format, // use existing milestone from previously posted roadmap
                "tip": "blah blah blah 1"
            },
            {
                "name": Milestone 2
                "milestoneId": null, // new milestone
                "tip": "blah blah blah 2"
            },
        ],
        "language": optional,  default is "english"
    **/

    //first we need to find/create existing tags
    let tagsDocs =  await Promise.all(clientPayload.tags.map(tag => Tags.add(tag)));

    let milestonesDocs = await Promise.all(clientPayload.milestones.map(m => Milestones.add({
        _id: m.milestoneId ? new ObjectId(m.milestoneId) : null,
        name: m.name,
        tips: [{
            userId: user._id,
            content: m.tip,
            votes: 0
        }],
        tags: tagsDocs.map(tag => tag._id),
        language: clientPayload.language
    })));

    return {
        name: clientPayload.name,
        userId: user._id,
        description: clientPayload.description,
        milestones: milestonesDocs.map(m => m._id),
        tags: tagsDocs.map(tag => tag._id),
        language: clientPayload.language,
        status: clientPayload.status
    }
}

module.exports = (router) => {
  router.use(express.json());
  router.post('/roadmap/create', [isAuthenticated, checkPayloadExist], async (req, res) => {
    let clientPayload = req.body;
    /**
        payload
    **/
    let payload = await generateCreatePayload(clientPayload, req.user).catch(e => console.error(e));
    if(!payload) {
        res.status(501).json({
            status: 0,
            error: "Something went wrong!"
        });
        return;
    }
    let roadmapDoc = await Roadmaps.add(payload).catch(e => console.error(e));
    if(!roadmapDoc) {
        res.status(501).json({
            status: 0,
            error: "Something went wrong!"
        });
        return;
    }

    return res.json({
        status:1,
        response: roadmapDoc
    })
  });

  router.get('/roadmap/get', [isAuthenticated, checkPayloadExist], (req, res) => {
    let payload = req.body;

  });
}


import express from "express";
import {ObjectId} from "mongodb";
import mongoose from "mongoose";
import {isAuthenticated} from "./utils/helper.js";


const Roadmaps = mongoose.model("roadmaps");
const Users = mongoose.model("users");
const Milestones = mongoose.model("milestones");
const Comments = mongoose.model("comments");
const Tags = mongoose.model("tags");
const Votes = mongoose.model("votes");

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
    console.log(clientPayload.milestones);

    let milestonesDocs = await Promise.all(clientPayload.milestones.map(async (m) => {
            let tipDoc = await Comments.create({type: "tips", userId: user._id, content: m.tip});
            let milestoneDoc = await Milestones.add({
                _id: m.milestoneId ? new mongoose.mongo.ObjectId(m.milestoneId) : null,
                name: m.name,
                tips: [tipDoc._id],
                tags: tagsDocs.map(tag => tag._id),
                language: clientPayload.language
            });
            tipDoc.parent_milestone = milestoneDoc._id;
            await tipDoc.save();
            return milestoneDoc;
        }));

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


function generateGetResponse(roadmapDoc) {
    //simplify roadmapDoc
    return {
        _id: roadmapDoc._id,
        name: roadmapDoc.name,
        userId: roadmapDoc.userId,
        description: roadmapDoc.description,
        milestones: roadmapDoc.milestones ? roadmapDoc.milestones.map(m => {
            if(!(m.tips[0] instanceof ObjectId)) {
                let author_tip = m.tips.filter(tip => tip.userId.toString() === roadmapDoc.userId.toString());
                author_tip = author_tip.length ? author_tip[0] : null;
                return {
                    _id: m._id,
                    name: m.name,
                    comments: m.comments,
                    author_tip: author_tip,
                    num_tips: m.tips.length // total number of tips given by other users
                }
            }
            return m;
        }) : [],
        votes: roadmapDoc.votes,
        tags: roadmapDoc.tags ? roadmapDoc.tags.map(tag => new Object({
            name: tag.name,
            num_roadmaps: tag.roadmaps.length,
            num_milestones: tag.milestones.length,
        })): [],
        comments: roadmapDoc.comments,
        status: roadmapDoc.status,
        language: roadmapDoc.language
    }
}

module.exports = (router) => {
    router.use(express.json());

    router.get('/roadmap/vote', [isAuthenticated], async (req, res) => {
        try {
            let id = req.query.id;
            let value = req.query.down ? -1 : 1;
            
            let resp = await Votes.findOneAndUpdate({
                userId: req.user._id, 
                roadmap: new mongoose.mongo.ObjectId(id)
            }, {
                    $setOnInsert: {
                        userId: req.user._id,
                        type: "roadmaps",
                        roadmap: new mongoose.mongo.ObjectId(id),
                        value: value
                    }
            }, {upsert:true, new:true, rawResult: true}).exec();

            if(resp.lastErrorObject.updatedExisting) {
                res.status(401).json({
                    status: 0,
                    error: "You have already voted!"
                });
                return;
            }

            res.json({
                status: 1,
                response: "Voted successfully"
            });
        } catch (e) {
            console.error(e);
            res.status(501).json({
                status: 0,
                error: "Something went wrong!"
            });
            return;
        }
    });

    router.get('/roadmap/getNumVotes', async (req, res) => {
        try {
            let id = new mongoose.mongo.ObjectId(req.query.id);
            let voted = false;
            if(req.user) {
                voted = (await Votes.findOne({
                    userId: req.user._id, 
                    roadmap: new mongoose.mongo.ObjectId(id)
                }).exec()) == null;
            }

            res.json({
                status: 1,
                response: {
                    total: await Votes.getNumVotes({roadmap: id}),
                    voted: voted
                }
            });
        } catch (e) {
            console.error(e);
            res.status(501).json({
                status: 0,
                error: "Something went wrong!"
            });
            return;
        }
    });

    router.get('/roadmap/search', async (req, res) => {
        try {
            let query = req.query.query;
            let results = await Roadmaps.aggregate([{
                    $searchBeta: {
                        text: {
                            query: query,
                            path: ["name", "description"]
                        }
                    }
                },
                {
                    $lookup: {
                        from: 'tags', 
                        localField: 'tags',
                        foreignField: '_id',
                        as: 'tags'
                    }
                }, {
                    $lookup: {
                        from: 'milestones', 
                        localField: 'milestones',
                        foreignField: '_id',
                        as: 'milestones'
                    }
                }
            ]);

            results = results ? results: [];
            // populate votes count
            // await Promise.all(results.map(async r => {
            //     let numVotes = await Votes.getTotalVotes({roadmap: r._id});
            //     r.votes = numVotes;
            // })).catch(e => console.error(e));
            results.sort((a,b) => b.votes - a.votes); // sort in descending order based on votes count
            res.json({
                status: 1,
                response: results.map(r =>generateGetResponse(r))
            });
        } catch (e) {
            console.error(e);
            res.status(501).json({
                status: 0,
                error: "Something went wrong!"
            });
            return;
        }

    });

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
        });
    });

    router.get('/roadmap/get', async (req, res) => {
        try {
            let roadmapId = new mongoose.mongo.ObjectId(req.query.id);
            console.log(roadmapId);
            let roadmapDoc = await Roadmaps.findOne({_id: roadmapId}).populate({path: "milestones", populate: {path: "tips", model: "comments"}}).populate("tags").lean().catch(e => console.error(e));
            if(!roadmapDoc) {
                res.status(501).json({
                    status: 0,
                    error: "Something went wrong!"
                });
                return;
            }
            res.json({
                status: 1,
                response: generateGetResponse(roadmapDoc)
            });
        } catch(e) {
            console.error(e);
            res.status(501).json({
                status: 0,
                error: "Something went wrong!"
            });
            return; 
        }

    });
}


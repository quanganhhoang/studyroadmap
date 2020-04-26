import express from "express";
import mongoose from "mongoose";
import {
    isAuthenticated
} from "./utils/helper.js";


const Roadmaps = mongoose.model("roadmaps");
const Users = mongoose.model("users");
const Milestones = mongoose.model("milestones");
const Tags = mongoose.model("tags");

function generateGetResponse(doc) {
    //simplify roadmapDoc
    return {
        _id: doc._id,
        name: doc.name,
        roadmaps: doc.roadmaps.map(r => {
            return {
                "_id": r._id,
                "name": r.name,
                "userId": r.userId,
                "votes": r.votes
            }
        }),
        tips: doc.tips,
        votes: doc.votes,
        tags: doc.tags.map(tag => new Object({
            name: tag.name,
            num_roadmaps: tag.roadmaps.length,
            num_milestones: tag.milestones.length,
        })),
        language: doc.language
    }
}

module.exports = (router) => {
    router.use(express.json());

    router.get('/milestone/vote', [isAuthenticated], async (req, res) => {
        try {
            let id = new mongoose.mongo.ObjectId(req.query.id);
            let value = req.query.down ? -1 : 1;

            if(!(await Milestones.findOne({_id: id}).exec())) {
                res.status(401).json({
                    status: 0,
                    error: "Milestone "+id+" doesn't exist"
                });
                return;
            }

            let resp = await Votes.findOneAndUpdate({
                userId: req.user._id, 
                milestone: id
            }, {
                    $setOnInsert: {
                        userId: req.user._id,
                        type: "milestones",
                        milestone: id,
                        value: value
                    }
            }, {upsert:true, new: true, rawResult: true}).exec();

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

    router.get('/milestone/getNumVotes', async (req, res) => {
        try {
            let id = new mongoose.mongo.ObjectId(req.query.id);
            let voted = false;
            if(req.user) {
                voted = (await Votes.findOne({
                    userId: req.user._id, 
                    milestone: id
                }).exec()) == null;
            }

            res.json({
                status: 1,
                response: {
                    total: await Votes.getNumVotes({milestone: id}),
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

    router.get('/milestone/search', async (req, res) => {
        try {
            let query = req.query.query;
            let results = await Milestones.aggregate([{
                    $searchBeta: {
                        text: {
                            query: query,
                            path: ["name"]
                        }
                    }
                },
                {
                    $lookup: {
                        from: 'tags', // I tried with 'Categories' and 'categories'
                        localField: 'tags',
                        foreignField: '_id',
                        as: 'tags'
                    }
                }
            ]);
            results = results ? results: [];
            results = results.map(r => generateGetResponse(r)); 
            
            // populate votes count
            await Promise.all(results.map(async r => {
                let numVotes = await Votes.getTotalVotes({milestone: r._id});
                r.votes = numVotes;
            })).catch(e => console.error(e));

            results.sort((a,b) => b.votes - a.votes); // sort in descending order based on votes count
            res.json({
                status: 1,
                response: results
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

    router.get('/milestone/get', async (req, res) => {
        try {
            let milestoneId = new mongoose.mongo.ObjectId(req.query.id);
            let milestoneDoc = await Milestones.findOne({
                _id: milestoneId
            }).populate("tags").populate("roadmaps").exec().catch(e => console.error(e));
            if (!milestoneDoc) {
                res.status(501).json({
                    status: 0,
                    error: "Something went wrong!"
                });
                return;
            }
            milestoneDoc.votes = await Votes.getTotalVotes({milestone: r._id});

            res.json({
                status: 1,
                response: generateGetResponse(milestoneDoc)
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
}
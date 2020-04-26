import express from "express";
import mongoose from "mongoose";
import {isAuthenticated, checkPayloadExist} from "./utils/helper.js";


const Roadmaps = mongoose.model("roadmaps");
const Users = mongoose.model("users");
const Milestones = mongoose.model("milestones");
const Tags = mongoose.model("tags");

module.exports = (router) => {
    router.use(express.json());

    router.get('/comment/create', [isAuthenticated, checkPayloadExist], async (req, res) => {

    });

    router.get('/comment/get', async (req, res) => {
        
    });
}


import express from "express";
import passport from "passport";

import roadmapApi from "./roadmap.js";
import milestoneApi from "./milestone.js";

const router = express.Router();
router.get('/current_user', (req, res) => {
    res.send(req.user);
  });

router.get('/logout', (req, res) => {
    req.logout();
    res.send(req.user);
});

//register apis
roadmapApi(router);
milestoneApi(router);

module.exports = router;
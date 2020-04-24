import express from "express";
import passport from "passport";

const router = express.Router();

router.get(
    '/google', 
    passport.authenticate('google', {
      scope: ['profile', 'email']
    })
);

router.get(
    '/google/callback', 
        passport.authenticate('google', {scope: 'https://www.googleapis.com/auth/plus.login', 
                                            successRedirect: '/', 
                                            failureRedirect: '/'
        })
);

module.exports = router;
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose')
const keys = require('../config/keys')

const User = mongoose.model('users')

passport.serializeUser((user, done) => {
  done(null, user.id);
})

passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    done(null, user);
  })
})

// when passport starts up, load this strategy as 'google'
// set proxy = true to deal with heroku proxy issue
passport.use(
  new GoogleStrategy({
    clientID: keys.googleClientID,
    clientSecret: keys.googleClientSecret,
    callbackURL: '/auth/google/callback',
    proxy: true,
  },
  async (accessToken, refreshToken, profile, done) => {
    // async call
    const existingUser = await User.findOne({
      googleId: profile.id
    })
  
    if (existingUser) {
      // we already have a record with the given profile ID
      return done(null, existingUser)
    }
    
    // make a new record
    const user = await new User({
      googleId: profile.id,
    }).save();

    return done(null, user);
  })
);

// TODO: add a new strategy


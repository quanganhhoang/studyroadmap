const express = require('express');
const mongoose = require('mongoose')
const cookieSession = require('cookie-session')
const passport = require('passport')
const keys= require('./config/keys')
const authRoutes = require('./routes/authRoutes'); // function exported from authRoutes.js

const app = express();

// ====== token setup ======
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey]
  })
)

app.use(passport.initialize());
app.use(passport.session());

// ====== token setup ======

require('./models/User') // this should be exported be passport is
require('./services/passport');

mongoose.connect(keys.mongoURI)

authRoutes(app);
const PORT = process.env.PORT || 5000; // to be read by heroku or 5000 by default in dev environment
app.listen(PORT);

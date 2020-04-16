const express = require('express')
// import express from 'express';

const app = express();

app.get('/', (req, res) => {
  res.send({hi: 'there'})
});

const PORT = process.env.PORT || 5000; // to be read by heroku or 5000 by default in dev environment
app.listen(PORT);

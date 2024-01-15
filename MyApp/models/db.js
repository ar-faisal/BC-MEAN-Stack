// models/db.js
const mongoose = require('mongoose');
const config = require('../config/config');

mongoose.connect(config.mongodb.uri, config.mongodb.options);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

module.exports = mongoose;

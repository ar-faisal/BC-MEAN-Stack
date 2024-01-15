const mongoose = require('./db');

const blackCofferSchema = new mongoose.Schema({
  end_year: Number,
  intensity: Number,
  sector: String,
  topic: String,
  insight: String,
  url: String,
  region: String,
  start_year: Number,
  impact: String,
  added: String,
  published: String,
  country: String,
  relevance: Number,
  pestle: String,
  source: String,
  title: String,
  likelihood: Number,
});

const BlackCofferModel = mongoose.model('BlackCoffer', blackCofferSchema, 'BlackCoffer');

// Check if there is any data in the BlackCoffer collection
async function checkAndPopulateCollection() {
  try {
    const count = await BlackCofferModel.countDocuments();

    if (count === 0) {
      // No data in the BlackCoffer collection, populate it with data from data.json
      await populateCollection();
    } else {
      // Data already exists in the BlackCoffer collection, no need to do anything
      console.log('Data already exists in the BlackCoffer collection.');
    }
  } catch (error) {
    console.error('Error checking and populating collection:', error);
  } finally {
    
  }
}

async function populateCollection() {
  try {
    // Populate BlackCoffer collection with data from data.json
    const jsonData = require('../public/data.json'); // Assuming data.json is in the same directory
    await BlackCofferModel.insertMany(jsonData);

    console.log('BlackCoffer collection populated successfully.');
  } catch (error) {
    console.error('Error populating collection:', error);
  }
}

// Call the function to check and populate the collection
checkAndPopulateCollection();

module.exports = BlackCofferModel; 
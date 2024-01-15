// index.js
const express = require('express');
const config = require('./config/config');
const cors = require('cors'); 

const dataController = require('./controllers/dataController'); // Import the data controller

const app = express();

app.use(cors());

app.use('/data', dataController); // Use the data controller for the '/data' route

app.get('/', (req, res) => {
  res.send('Hello susu World');
});

const port = config.server.port;
app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});

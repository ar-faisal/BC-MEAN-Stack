// controllers/dataController.js
const express = require('express');
const router = express.Router();
const BlackCofferModel = require('../models/BlackCofferModel'); 

// Define route to fetch data
router.get('/getData', async (req, res) => {
  try {
    let query = {};

    if (req.query) {
      query = req.query;
    }
    
    
    const result = await BlackCofferModel.find(query);
    

    ////////////////////////////////////////count of companies & start year///////////////////////////////////
    const countByStartYear = await result.reduce((acc, item) => {
      acc[item.start_year] = (acc[item.start_year] || 0) + 1;
      return acc;
    }, {});

    
    ///////////////////////////////////////Countries and relavance//////////////////////////////////////////
    const groupedChartData = result.reduce((acc, item) => {
      const { country, relevance } = item;
    
      // Initialize if not exist
      acc[country] = acc[country] || { "total": 0, "count": 0 };
    
      // Accumulate relevance values
      acc[country].total += relevance;
      acc[country].count++;
    
      return acc;
    }, {});
    
    // Calculate average relevance for each country and round to 1 decimal point
    const formattedChartData = Object.keys(groupedChartData).map(country => {
      const total = groupedChartData[country].total;
      const count = groupedChartData[country].count;
      const averageRelevance = Math.round((total / count) * 10) / 10;
    
      return { country, averageRelevance };
    });
    
    // Sort the array in descending order based on averageRelevance
    const sortedChartData = formattedChartData.sort((a, b) => b.averageRelevance - a.averageRelevance);
    
    // Take the top 10 countries
    const top10ChartData = sortedChartData.slice(0, 10);
    
    // If you want to keep the structure as an array of objects with country as the key
    const top10ChartDataObject = top10ChartData.reduce((acc, entry) => {
      acc[entry.country] = entry.averageRelevance;
      return acc;
    }, {});
    

    //////////////////////////////////////Sector- likelihood///////////////////////////////////////
    
        // Create a map to store aggregated data
        const aggregatedDataMap = new Map();

        // Calculate average likelihood for each sector
        result.forEach(entry => {
          const sector = entry.sector;
          const likelihood = entry.likelihood;

          if (!aggregatedDataMap.has(sector)) {
            aggregatedDataMap.set(sector, { sum: likelihood, count: 1 });
          } else {
            const currentData = aggregatedDataMap.get(sector);
            currentData.sum += likelihood;
            currentData.count += 1;
            aggregatedDataMap.set(sector, currentData);
          }
        });

        // Create a single object with key-value pairs
        const pieChartData = {};

        [...aggregatedDataMap.entries()].forEach(([sector, data]) => {
          pieChartData[sector] = Number((data.sum / data.count).toFixed(1)); // Round to one decimal point
        });

          
    /////////////////////////////////STack Bar Chart///////////////////////////////////////////////////
    const groupedBySector = result.reduce((acc, item) => {
      // Check if sector is not an empty string
      if (item.sector.trim() !== "") {
        if (!acc[item.sector]) {
          acc[item.sector] = { sector: item.sector, likelihoodSum: 0, relevanceSum: 0, count: 0 };
        }
    
        acc[item.sector].likelihoodSum += item.likelihood;
        acc[item.sector].relevanceSum += item.relevance;
        acc[item.sector].count += 1;
      }
    
      return acc;
    }, {});
    
    // Calculate averages and format the result concisely
    const averagedData = Object.values(groupedBySector).map((group) => [
      group.sector,
      parseFloat((group.likelihoodSum / group.count).toFixed(1)),
      parseFloat((group.relevanceSum / group.count).toFixed(1)),
    ]);
    
    
    

/////////////////////////////////Scatter Chart///////////////////////////////////////////////////
const groupedByPestle = result.reduce((acc, item) => {
  // Check if sector is not an empty string
  if (item.pestle.trim() !== "") {
    if (!acc[item.pestle]) {
      acc[item.pestle] = { pestle: item.pestle, likelihoodSum: 0, relevanceSum: 0, count: 0 };
    }

    acc[item.pestle].likelihoodSum += item.likelihood;
    acc[item.pestle].relevanceSum += item.relevance;
    acc[item.pestle].count += 1;
  }

  return acc;
}, {});

// Calculate averages and format the result concisely
const averagedData2 = Object.values(groupedByPestle).map((group) => [
  group.pestle,
  parseFloat((group.likelihoodSum / group.count).toFixed(1)),
  parseFloat((group.relevanceSum / group.count).toFixed(1)),
]);



    


    res.status(200).json({ countByStartYear, countryRelavance: top10ChartDataObject, sectorLikelihood :  pieChartData, StackBarChart : averagedData, ScatterChart :  averagedData2}); 
  } catch (error) {
    console.error('Error fetching data from MongoDB:', error);
    res.status(500).send('Internal Server Error');
  }

});

router.get('/attributeValues/:attribute', async (req, res) => {
  try {
    const attribute = req.params.attribute;
    
    // Fetch unique values for the specified attribute from your MongoDB collection
    const values = await BlackCofferModel.distinct(attribute);

    res.status(200).json(values);
  } catch (error) {
    console.error('Error fetching attribute values:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;

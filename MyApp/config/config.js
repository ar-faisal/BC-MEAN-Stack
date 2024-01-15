// config/config.js
module.exports = {
    mongodb: {
      
      uri: 'mongodb://localhost:27017/MongoDB', 
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    },
    server: {
      port: process.env.PORT || 3000,
    },
  };
  